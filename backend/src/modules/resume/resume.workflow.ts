import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { extractResumeText, sanitizeResumeText } from './resume.extractor.js';
import { analyzeResumeWithGroq, fixResumeWithGroq } from './resume.ai.js';
import type { ResumeAnalysis, ResumeFix, ResumeProblem } from './resume.schema.js';
import { AppError } from '../../app.js';

type Operation = 'analyze' | 'fix' | 'recheck';

const ResumeWorkflowState = Annotation.Root({
  operation: Annotation<Operation>,
  fileBuffer: Annotation<Buffer | undefined>,
  filename: Annotation<string | undefined>,
  mimetype: Annotation<string | undefined>,
  resumeText: Annotation<string>,
  targetRole: Annotation<string>,
  instruction: Annotation<string>,
  analysis: Annotation<ResumeAnalysis | undefined>,
  score: Annotation<number | undefined>,
  problems: Annotation<ResumeProblem[]>,
  suggestions: Annotation<ResumeProblem[]>,
  fix: Annotation<ResumeFix | undefined>
});

const extractTextNode = async (state: typeof ResumeWorkflowState.State) => {
  if (state.fileBuffer && state.filename && state.mimetype) {
    return {
      resumeText: await extractResumeText({
        buffer: state.fileBuffer,
        filename: state.filename,
        mimetype: state.mimetype
      })
    };
  }

  const resumeText = sanitizeResumeText(state.resumeText || '');
  if (resumeText.length < 50) {
    throw new AppError(400, 'INVALID_RESUME_TEXT', 'Resume text must contain at least 50 characters.');
  }
  return { resumeText };
};

const autoFixNode = async (state: typeof ResumeWorkflowState.State) => ({
  fix: await fixResumeWithGroq({
    resumeText: state.resumeText,
    targetRole: state.targetRole,
    instruction: state.instruction
  })
});

const createFixFallbackAnalysis = (
  resumeText: string,
  targetRole: string,
  fix?: ResumeFix
): ResumeAnalysis => ({
  atsScore: 70,
  scoreExplanation: 'The resume rewrite was generated, but the AI recheck service could not rescore it in this request.',
  summary: 'AI improvements were applied. Run Recheck to refresh the ATS score and issue list.',
  categoryScores: {
    atsCompatibility: 70,
    structure: 70,
    grammar: 70,
    skills: 70,
    projects: 70,
    experience: 70,
    education: 70,
    keywords: targetRole ? 68 : 65,
    formatting: 75
  },
  strengths: (fix?.changes?.length ? fix.changes : [
    'Generated an ATS-friendly rewrite while preserving the original resume facts.'
  ]).slice(0, 8),
  missingKeywords: [],
  problems: [{
    id: 'recheck-needed',
    title: 'Recheck the improved resume',
    category: 'ats',
    severity: 'suggestion',
    why: 'The rewrite completed, but automatic rescoring was unavailable during this request.',
    suggestedFix: 'Use the Recheck action after reviewing the improved resume text.',
    originalContent: resumeText.slice(0, 500),
    improvedContent: 'Run Recheck to refresh ATS score, missing keywords, and remaining issues.'
  }]
});

const analyzeNode = async (state: typeof ResumeWorkflowState.State) => {
  const textToAnalyze = state.fix?.improvedText || state.resumeText;
  try {
    return {
      resumeText: textToAnalyze,
      analysis: await analyzeResumeWithGroq(textToAnalyze, state.targetRole)
    };
  } catch (error) {
    if (state.operation === 'fix' && state.fix?.improvedText) {
      console.warn('Resume fix recheck failed; returning rewrite with fallback analysis', {
        name: (error as { name?: string })?.name,
        message: (error as { message?: string })?.message?.slice(0, 300)
      });

      return {
        resumeText: textToAnalyze,
        analysis: createFixFallbackAnalysis(textToAnalyze, state.targetRole, state.fix)
      };
    }

    throw error;
  }
};

const scoreNode = async (state: typeof ResumeWorkflowState.State) => ({
  score: state.analysis?.atsScore
});

const detectProblemsNode = async (state: typeof ResumeWorkflowState.State) => ({
  problems: state.analysis?.problems || []
});

const suggestFixesNode = async (state: typeof ResumeWorkflowState.State) => ({
  suggestions: (state.problems || []).filter(problem => problem.improvedContent)
});

const recalculateScoreNode = async (state: typeof ResumeWorkflowState.State) => ({
  score: Math.max(0, Math.min(100, Math.round(state.analysis?.atsScore || 0)))
});

const workflow = new StateGraph(ResumeWorkflowState)
  .addNode('extract_text', extractTextNode)
  .addNode('auto_fix', autoFixNode)
  .addNode('analyze_resume', analyzeNode)
  .addNode('generate_score', scoreNode)
  .addNode('detect_problems', detectProblemsNode)
  .addNode('suggest_fixes', suggestFixesNode)
  .addNode('recalculate_score', recalculateScoreNode)
  .addEdge(START, 'extract_text')
  .addConditionalEdges(
    'extract_text',
    state => state.operation === 'fix' ? 'auto_fix' : 'analyze_resume',
    ['auto_fix', 'analyze_resume']
  )
  .addEdge('auto_fix', 'analyze_resume')
  .addEdge('analyze_resume', 'generate_score')
  .addEdge('generate_score', 'detect_problems')
  .addEdge('detect_problems', 'suggest_fixes')
  .addEdge('suggest_fixes', 'recalculate_score')
  .addEdge('recalculate_score', END)
  .compile();

export async function runResumeWorkflow(input: {
  operation: Operation;
  fileBuffer?: Buffer;
  filename?: string;
  mimetype?: string;
  resumeText?: string;
  targetRole?: string;
  instruction?: string;
}) {
  const result = await workflow.invoke({
    operation: input.operation,
    fileBuffer: input.fileBuffer,
    filename: input.filename,
    mimetype: input.mimetype,
    resumeText: input.resumeText || '',
    targetRole: input.targetRole?.trim() || '',
    instruction: input.instruction?.trim() || '',
    problems: [],
    suggestions: []
  });

  if (!result.analysis || result.score === undefined) {
    throw new AppError(502, 'INCOMPLETE_AI_REVIEW', 'The AI review returned an incomplete result.');
  }

  return {
    resumeText: result.resumeText,
    analysis: {
      ...result.analysis,
      atsScore: result.score,
      problems: result.problems
    },
    suggestions: result.suggestions,
    fix: result.fix
  };
}
