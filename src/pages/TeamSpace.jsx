import React, { useState, useEffect, useRef } from 'react';
import {
  Users, FolderGit2, Plus, MessageSquare, BarChart3,
  UserCheck, Shield, LogOut, CheckSquare, PlusCircle,
  FileText, Upload, Calendar, Clock, AlertCircle, Play,
  Send, Trash2, ShieldAlert, Award, FileCode, CheckCircle2, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

// Design styles mapping
const cardStyleClass = `glass-panel p-6 rounded-3xl border border-indigo-500/10 dark:border-indigo-500/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300`;
const buttonPrimaryClass = `px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/10 transition-all`;
const buttonSecondaryClass = `px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all`;
const inputClass = `w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-slate-900 dark:text-white text-xs`;

export default function TeamSpace({ isLoggedIn, userData, authToken }) {
  // UI Tabs
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'projects' | 'chat' | 'analytics'
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // Modals & Forms
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [invites, setInvites] = useState([]);
  
  // Projects & Collaborative Space
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectWorkspaceTab, setProjectWorkspaceTab] = useState('kanban'); // 'kanban' | 'docs' | 'files'
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectDiff, setNewProjectDiff] = useState('Beginner');
  const [newProjectTrack, setNewProjectTrack] = useState('Web Dev');

  // Tasks
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskComments, setTaskComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Documents (Wikis)
  const [createDocOpen, setCreateDocOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');

  // File Upload
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Chat/Communication
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatType, setChatType] = useState('team'); // 'team' | 'dm'
  const [dmTargetMember, setDmTargetMember] = useState(null);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const socketRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Analytics
  const [metrics, setMetrics] = useState(null);

  // Fetch all user teams and pending invitations
  const fetchTeamsAndInvites = async () => {
    if (!isLoggedIn || !authToken) return;
    setLoading(true);
    setApiError('');
    try {
      // Fetch user's teams
      const teamsRes = await fetch('/api/v1/teams', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData);
        if (teamsData.length > 0 && !selectedTeam) {
          setSelectedTeam(teamsData[0]);
        }
      }

      // Fetch pending invitations
      const invitesRes = await fetch('/api/v1/teams/invitations', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (invitesRes.ok) {
        const invitesData = await invitesRes.json();
        setInvites(invitesData);
      }
    } catch (err) {
      setApiError('Failed to synchronize team space.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamsAndInvites();
  }, [isLoggedIn, authToken]);

  // Fetch details when a team is selected
  const loadTeamData = async () => {
    if (!selectedTeam || !authToken) return;
    try {
      // Get detailed team details (members + projects)
      const res = await fetch(`/api/v1/teams/${selectedTeam.id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const fullTeam = await res.json();
        setSelectedTeam(fullTeam);
        setProjects(fullTeam.projects || []);
      }

      // Get dashboard metrics
      const metricsRes = await fetch(`/api/v1/teams/${selectedTeam.id}/dashboard`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }
    } catch (err) {
      console.error('Error fetching team metrics:', err);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [selectedTeam?.id, authToken]);

  // WebSocket Live Chat Setup
  useEffect(() => {
    if (!selectedTeam || !authToken) return;
    
    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Connect to WebSocket chat endpoint
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host; // E.g., localhost:5173
    
    // Connect to backend WS directly (assumes local proxy in development or port 3001)
    const wsUrl = `${protocol}//${host.split(':')[0]}:3001/api/v1/chat/ws?token=${authToken}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('🔌 Real-time WebSockets Chat active');
      // Request initial history
      fetchChatHistory();
    };

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type === 'message') {
        const msg = parsed.message;
        
        // Match active filters to render
        const isMsgForCurrentTeam = msg.teamId === selectedTeam.id;
        const isMsgForCurrentProject = selectedProject && msg.projectId === selectedProject.id;
        const isMsgDM = dmTargetMember && (
          (msg.senderId === userData.id && msg.receiverId === dmTargetMember.user.id) ||
          (msg.senderId === dmTargetMember.user.id && msg.receiverId === userData.id)
        );

        if (isMsgForCurrentProject || (isMsgForCurrentTeam && !msg.projectId && !msg.receiverId) || isMsgDM) {
          setChatMessages((prev) => [...prev, msg]);
          setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
        }
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket connection closed');
    };

    return () => {
      if (ws) ws.close();
    };
  }, [selectedTeam?.id, selectedProject?.id, dmTargetMember?.user.id, authToken]);

  // Fetch Chat History via API
  const fetchChatHistory = async () => {
    if (!selectedTeam || !authToken) return;
    try {
      let url = `/api/v1/chat/messages?teamId=${selectedTeam.id}`;
      if (selectedProject) {
        url = `/api/v1/chat/messages?projectId=${selectedProject.id}`;
      } else if (chatType === 'dm' && dmTargetMember) {
        url = `/api/v1/chat/messages?receiverId=${dmTargetMember.user.id}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const history = await res.json();
        setChatMessages(history);
        setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'auto' }), 50);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  // Trigger history fetch on scope toggles
  useEffect(() => {
    fetchChatHistory();
  }, [selectedProject?.id, chatType, dmTargetMember?.user.id]);

  // Create Team Submit
  const handleCreateTeamSubmit = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setApiError('');
    try {
      const res = await fetch('/api/v1/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ name: newTeamName, description: newTeamDesc })
      });
      const data = await res.json();
      if (res.ok) {
        setTeams((prev) => [...prev, data]);
        setSelectedTeam(data);
        setNewTeamName('');
        setNewTeamDesc('');
        setCreateTeamOpen(false);
      } else {
        setApiError(data.message || 'Failed to create team.');
      }
    } catch (err) {
      setApiError('Network request failure.');
    }
  };

  // Invite Member Submit
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedTeam) return;
    setApiError('');
    try {
      const res = await fetch(`/api/v1/teams/${selectedTeam.id}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ inviteeEmail: inviteEmail, role: 'MEMBER' })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Invitation sent successfully!');
        setInviteEmail('');
      } else {
        setApiError(data.message || 'Failed to send invitation.');
      }
    } catch (err) {
      setApiError('Network request failure.');
    }
  };

  // Respond Invitation
  const handleInviteResponse = async (inviteId, status) => {
    setApiError('');
    try {
      const res = await fetch(`/api/v1/teams/invitations/${inviteId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setInvites((prev) => prev.filter((i) => i.id !== inviteId));
        fetchTeamsAndInvites();
      } else {
        const data = await res.json();
        setApiError(data.message || 'Failed to process invitation.');
      }
    } catch (err) {
      setApiError('Network request failure.');
    }
  };

  // Change member role
  const handleMemberRoleChange = async (memberUserId, currentRole) => {
    if (!selectedTeam) return;
    const nextRole = currentRole === 'LEADER' ? 'MEMBER' : 'LEADER';
    try {
      const res = await fetch(`/api/v1/teams/${selectedTeam.id}/members/${memberUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ role: nextRole })
      });
      if (res.ok) {
        loadTeamData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Kick member
  const handleRemoveMember = async (memberUserId) => {
    if (!selectedTeam || !confirm('Are you sure you want to remove this member from the team?')) return;
    try {
      const res = await fetch(`/api/v1/teams/${selectedTeam.id}/members/${memberUserId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        loadTeamData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Leave Team
  const handleLeaveTeam = async () => {
    if (!selectedTeam || !confirm('Are you sure you want to leave this team?')) return;
    try {
      const res = await fetch(`/api/v1/teams/${selectedTeam.id}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const remaining = teams.filter((t) => t.id !== selectedTeam.id);
        setTeams(remaining);
        setSelectedTeam(remaining.length > 0 ? remaining[0] : null);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to leave team');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Project Submit
  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !selectedTeam) return;
    try {
      const res = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: newProjectTitle,
          description: newProjectDesc,
          difficulty: newProjectDiff,
          track: newProjectTrack,
          teamId: selectedTeam.id
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => [...prev, data]);
        setNewProjectTitle('');
        setNewProjectDesc('');
        setCreateProjectOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Project Workspace
  const handleOpenProjectWorkspace = async (proj) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/projects/${proj.id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedProject(data);
        setProjectWorkspaceTab('kanban');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create Task Submit
  const handleCreateTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProject) return;
    try {
      const payload = {
        projectId: selectedProject.id,
        title: newTaskTitle,
        description: newTaskDesc,
        priority: newTaskPriority,
        dueDate: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : undefined,
        assigneeId: newTaskAssignee || null
      };

      const res = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh project workspace
        handleOpenProjectWorkspace(selectedProject);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskAssignee('');
        setNewTaskDueDate('');
        setCreateTaskOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Task Status
  const handleUpdateTaskStatus = async (taskId, nextStatus) => {
    try {
      const res = await fetch(`/api/v1/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        handleOpenProjectWorkspace(selectedProject);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Select Task to View Details & Comments
  const handleSelectTask = async (task) => {
    setSelectedTask(task);
    try {
      const res = await fetch(`/api/v1/tasks/${task.id}/comments`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const comments = await res.json();
        setTaskComments(comments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Task Comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTask) return;
    try {
      const res = await fetch(`/api/v1/tasks/${selectedTask.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ content: newComment })
      });
      const data = await res.json();
      if (res.ok) {
        setTaskComments((prev) => [...prev, data]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Document (Wiki) Submit
  const handleCreateDocSubmit = async (e) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !selectedProject) return;
    try {
      const res = await fetch(`/api/v1/projects/${selectedProject.id}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ title: newDocTitle, content: newDocContent })
      });
      if (res.ok) {
        handleOpenProjectWorkspace(selectedProject);
        setNewDocTitle('');
        setNewDocContent('');
        setCreateDocOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadError('');
    setUploadSuccess(false);

    if (!file) return;

    // Secure File Upload Validation: Size <= 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.');
      return;
    }

    const ALLOWED_MIME_TYPES = [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'image/jpeg',
      'image/png',
      'text/plain',
      'text/markdown',
      'application/json'
    ];

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadError('Permitted formats: PDF, ZIP, JPG, PNG, TXT, MD, JSON.');
      return;
    }

    setFileToUpload(file);
  };

  // Secure File Upload Submit (Simulates S3 metadata write)
  const handleFileUpload = async () => {
    if (!fileToUpload || !selectedProject) return;
    try {
      const payload = {
        name: fileToUpload.name,
        size: fileToUpload.size,
        mimeType: fileToUpload.type,
        url: `https://pec-storage.s3.amazonaws.com/${selectedProject.id}/${Date.now()}-${fileToUpload.name}`
      };

      const res = await fetch(`/api/v1/projects/${selectedProject.id}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setUploadSuccess(true);
        setFileToUpload(null);
        handleOpenProjectWorkspace(selectedProject);
      } else {
        const data = await res.json();
        setUploadError(data.message || 'File upload rejected by server validation.');
      }
    } catch (err) {
      setUploadError('Network error uploading file metadata.');
    }
  };

  // Send Socket Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    const payload = {
      type: 'message',
      content: newMessage,
      isAnnouncement: isAnnouncement
    };

    if (selectedProject) {
      payload.projectId = selectedProject.id;
    } else if (chatType === 'dm' && dmTargetMember) {
      payload.receiverId = dmTargetMember.user.id;
    } else if (selectedTeam) {
      payload.teamId = selectedTeam.id;
    }

    socketRef.current.send(JSON.stringify(payload));
    setNewMessage('');
    setIsAnnouncement(false);
  };

  // Determine current user's team membership role
  const getMyTeamRole = () => {
    if (!selectedTeam || !userData) return 'MEMBER';
    const member = selectedTeam.members?.find((m) => m.userId === userData.id);
    return member ? member.role : 'MEMBER';
  };

  const isLeader = getMyTeamRole() === 'LEADER' || userData?.role === 'admin' || userData?.role === 'super_admin';

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto min-h-[60vh] space-y-6">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">Authentication Required</h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Please Sign In to access the Team Collaboration Space, manage team sprints, projects, and engage in real-time developer communications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-left">
      
      {/* ==========================================
          HEADER PANEL & TEAM PICKER
          ========================================== */}
      <div className="glass-panel p-6 rounded-3xl flex justify-between items-center flex-wrap gap-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-extrabold shadow shadow-indigo-500/10">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
              Collaborative Team Space
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Work on sprints, organize Kanban boards, share wikis, upload assets, and chat in real-time.
            </p>
          </div>
        </div>

        {/* Dropdown team picker */}
        <div className="flex items-center gap-2">
          {teams.length > 0 && (
            <select
              value={selectedTeam?.id || ''}
              onChange={(e) => {
                const team = teams.find((t) => t.id === e.target.value);
                setSelectedTeam(team);
                setSelectedProject(null);
                setChatType('team');
                setDmTargetMember(null);
              }}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold px-4 py-2.5 rounded-xl outline-none"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => setCreateTeamOpen(true)}
            className="p-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-md shadow-indigo-650/10"
          >
            <Plus className="w-4 h-4" /> Create Team
          </button>
        </div>
      </div>

      {/* API ERROR BANNER */}
      {apiError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2 text-xs font-semibold text-rose-500">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{apiError}</span>
        </div>
      )}

      {/* NO TEAMS WELCOME VIEW */}
      {teams.length === 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className={`${cardStyleClass} flex flex-col justify-between`}>
            <div className="space-y-4">
              <span className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-brand-primary flex items-center justify-center"><PlusCircle className="w-5 h-5" /></span>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white font-sora">Create a Team</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Start a new engineering squad! Define your goals, create coding sprint repositories, invite peers via email, and kickstart collaborative roadmap assignments.
              </p>
            </div>
            <button onClick={() => setCreateTeamOpen(true)} className={`${buttonPrimaryClass} mt-6 w-fit`}>
              Initialize New Team
            </button>
          </div>

          <div className={`${cardStyleClass} flex flex-col justify-between`}>
            <div className="space-y-4">
              <span className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-brand-primary flex items-center justify-center"><Mail className="w-5 h-5" /></span>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white font-sora">Pending Invitations ({invites.length})</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                View invitation invites sent by other developers. Accept to immediately gain access to their shared repositories, Kanban boards, and communication lines.
              </p>
            </div>
            
            {invites.length > 0 ? (
              <div className="space-y-2 mt-6">
                {invites.map((invite) => (
                  <div key={invite.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-slate-800 dark:text-white font-bold">{invite.team.name}</strong>
                      <span className="text-[10px] text-slate-455 block">Invited by: {invite.inviter.fullName}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleInviteResponse(invite.id, 'ACCEPTED')} className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold">Accept</button>
                      <button onClick={() => handleInviteResponse(invite.id, 'REJECTED')} className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-400 block italic mt-6">No pending team invitations received.</span>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE TEAM WORKSPACE LAYOUT */}
      {selectedTeam && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* LEFT COLUMN: NAVIGATION & CONTROLS */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Sidebar Navigation */}
            <div className={`${cardStyleClass} p-4 space-y-2`}>
              <span className="text-[9.5px] uppercase font-bold text-slate-455 tracking-wider block px-2.5 mb-2">Workspace Navigation</span>
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: Users },
                { id: 'projects', label: 'Projects & Sprints', icon: FolderGit2 },
                { id: 'chat', label: 'Real-Time Chat', icon: MessageSquare },
                { id: 'analytics', label: 'Team Analytics', icon: BarChart3 }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSelectedProject(null);
                      setChatType('team');
                      setDmTargetMember(null);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-500/10 text-brand-primary border-l-2 border-indigo-500 pl-3'
                        : 'text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-655 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Team Members panel */}
            <div className={`${cardStyleClass} p-5 space-y-4`}>
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-[10px] uppercase font-bold text-slate-455 tracking-wider">Active Members</span>
                <span className="text-[10px] font-extrabold text-indigo-500">{selectedTeam.members?.length || 0} online</span>
              </div>

              <div className="space-y-3.5 max-h-[200px] overflow-y-auto pr-1">
                {selectedTeam.members?.map((m) => (
                  <div key={m.id} className="flex justify-between items-center text-xs">
                    <button
                      onClick={() => {
                        setDmTargetMember(m);
                        setChatType('dm');
                        setSelectedProject(null);
                        setActiveTab('chat');
                      }}
                      className="flex gap-2.5 items-center hover:underline text-left"
                    >
                      <div className="w-7.5 h-7.5 rounded-lg bg-indigo-550/15 text-brand-primary flex items-center justify-center font-bold">
                        {m.user.fullName.charAt(0)}
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-white block truncate max-w-[100px] font-semibold">{m.user.fullName}</strong>
                        <span className="text-[9px] text-slate-450 block uppercase font-extrabold flex items-center gap-0.5">
                          {m.role === 'LEADER' ? <Shield className="w-2.5 h-2.5 text-brand-secondary" /> : <Users className="w-2.5 h-2.5 text-slate-400" />}
                          {m.role}
                        </span>
                      </div>
                    </button>

                    {/* Member actions for Leaders */}
                    {isLeader && m.userId !== userData.id && (
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleMemberRoleChange(m.userId, m.role)}
                          title="Toggle member/leader status"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-[9px] font-bold"
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => handleRemoveMember(m.userId)}
                          title="Kick member"
                          className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Invite Form inside sidebar */}
              {isLeader && (
                <form onSubmit={handleInviteSubmit} className="pt-2 border-t border-slate-200 dark:border-slate-800/60 space-y-2">
                  <span className="text-[9px] font-bold text-slate-450 block">Invite Member by Email</span>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-white"
                  />
                  <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition-colors">
                    Send Team Invite
                  </button>
                </form>
              )}
            </div>

            {/* Leave Team Button */}
            <button
              onClick={handleLeaveTeam}
              className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Leave Team
            </button>
          </div>

          {/* RIGHT COLUMNS (3/4 grid - col-span-3): ACTIVE DISPLAY TAB */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Welcoming widget */}
                <div className={`${cardStyleClass} bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 p-6`}>
                  <h2 className="text-xl font-extrabold text-slate-950 dark:text-white leading-tight font-sora">
                    Team: {selectedTeam.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                    {selectedTeam.description || 'Define your goals and organize your development path together.'}
                  </p>
                </div>

                {/* Aggregate analytics cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`${cardStyleClass} text-center p-5`}>
                    <span className="text-[10px] uppercase font-bold text-slate-455 tracking-wider block mb-2">Projects Created</span>
                    <strong className="text-2xl font-extrabold text-slate-950 dark:text-white font-sora block">{projects.length}</strong>
                  </div>
                  <div className={`${cardStyleClass} text-center p-5`}>
                    <span className="text-[10px] uppercase font-bold text-slate-455 tracking-wider block mb-2">Sprints Active</span>
                    <strong className="text-2xl font-extrabold text-slate-950 dark:text-white font-sora block">{metrics?.totalTasks || 0} Tasks</strong>
                  </div>
                  <div className={`${cardStyleClass} text-center p-5`}>
                    <span className="text-[10px] uppercase font-bold text-slate-455 tracking-wider block mb-2">Team Success Ratio</span>
                    <strong className="text-2xl font-extrabold text-emerald-500 font-sora block">{metrics?.completionRate || 0}%</strong>
                  </div>
                </div>

                {/* Team Announcements Widget */}
                <div className={`${cardStyleClass} p-5 space-y-3.5`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-950 dark:text-white flex items-center gap-1.5 uppercase tracking-wider font-sora">
                      <AlertCircle className="w-4 h-4 text-brand-secondary animate-pulse" /> Pinned Announcements
                    </h3>
                  </div>
                  <div className="p-4 bg-amber-500/5 dark:bg-slate-950 border border-amber-500/15 dark:border-slate-805 rounded-2xl text-xs space-y-2">
                    <span className="text-[9.5px] uppercase font-extrabold text-amber-500 tracking-wider">LATEST BROADCAST</span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 leading-normal">
                      Welcome team! To kickstart our first project, open the "Projects & Sprints" tab, create a project outline, and populate the Kanban board with task tickets. Use mentions in the chat rooms to assign roles!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PROJECTS */}
            {activeTab === 'projects' && !selectedProject && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-extrabold text-slate-955 dark:text-white uppercase tracking-wider">Team Projects</h3>
                  <button onClick={() => setCreateProjectOpen(true)} className={buttonPrimaryClass}>
                    <Plus className="w-4.5 h-4.5" /> Initialize Project
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((proj) => {
                    const completed = proj.tasks?.filter((t) => t.status === 'COMPLETED').length || 0;
                    const total = proj.tasks?.length || 0;
                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                    
                    return (
                      <div key={proj.id} className={`${cardStyleClass} flex flex-col justify-between hover:border-slate-350 dark:hover:border-slate-700`}>
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-indigo-500/10 text-brand-primary">
                              {proj.difficulty}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">{proj.track}</span>
                          </div>
                          
                          <h4 className="text-base font-extrabold text-slate-950 dark:text-white font-sora leading-tight">{proj.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">{proj.description}</p>
                        </div>

                        <div className="space-y-3.5 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/40">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-450 uppercase">Kanban Sprints</span>
                            <span>{completed}/{total} Tasks ({pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }}></div>
                          </div>

                          <button onClick={() => handleOpenProjectWorkspace(proj)} className={`${buttonSecondaryClass} w-full text-center justify-center mt-2`}>
                            Open Collaboration Workspace <Play className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {projects.length === 0 && (
                    <div className="md:col-span-2 text-center p-12 text-slate-400 italic text-xs bg-slate-50 dark:bg-slate-950/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                      No collaborative projects created yet. Click "Initialize Project" to begin.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROJECT DETAILED COLLABORATION WORKSPACE */}
            {activeTab === 'projects' && selectedProject && (
              <div className="space-y-6">
                
                {/* Back to project list row */}
                <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-4">
                  <div>
                    <button onClick={() => setSelectedProject(null)} className="text-xs font-bold text-indigo-550 dark:text-brand-accent hover:underline mb-1 flex items-center gap-1">
                      &larr; Back to all projects
                    </button>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-sora leading-tight">
                      {selectedProject.title}
                    </h3>
                  </div>

                  <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs shrink-0">
                    {[
                      { id: 'kanban', label: 'Kanban Board', icon: CheckSquare },
                      { id: 'docs', label: 'Shared Wiki', icon: FileText },
                      { id: 'files', label: 'File Vault', icon: Upload }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = projectWorkspaceTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setProjectWorkspaceTab(tab.id)}
                          className={`px-3 py-1.5 font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                            isActive
                              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                              : 'text-slate-550 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-tab: KANBAN BOARD */}
                {projectWorkspaceTab === 'kanban' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Manage tasks across progress columns</span>
                      <button onClick={() => setCreateTaskOpen(true)} className={buttonPrimaryClass}>
                        <Plus className="w-4 h-4" /> Create Task Ticket
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      {[
                        { id: 'TO_DO', label: 'To Do', color: 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20' },
                        { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-500/20 bg-blue-500/5' },
                        { id: 'UNDER_REVIEW', label: 'Under Review', color: 'border-amber-500/20 bg-amber-500/5' },
                        { id: 'COMPLETED', label: 'Completed', color: 'border-emerald-500/25 bg-emerald-500/5' }
                      ].map((col) => {
                        const colTasks = selectedProject.tasks?.filter((t) => t.status === col.id) || [];
                        
                        return (
                          <div key={col.id} className={`p-4 border rounded-2xl flex flex-col space-y-3.5 min-h-[350px] ${col.color}`}>
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-2">
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">{col.label}</span>
                              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-2 py-0.5 rounded-full font-extrabold">{colTasks.length}</span>
                            </div>

                            <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-0.5">
                              {colTasks.map((task) => (
                                <div
                                  key={task.id}
                                  onClick={() => handleSelectTask(task)}
                                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-805 rounded-xl hover:-translate-y-0.5 hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-sm transition-all text-left cursor-pointer space-y-2.5"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                      task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-500' :
                                      task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-500'
                                    }`}>
                                      {task.priority}
                                    </span>
                                    {task.dueDate && (
                                      <span className="text-[8.5px] text-slate-400 flex items-center gap-0.5">
                                        <Clock className="w-2.5 h-2.5" /> {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </span>
                                    )}
                                  </div>

                                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{task.title}</h5>

                                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[9px] text-slate-455">
                                    <span className="truncate max-w-[80px]">Assignee: {task.assignee?.fullName || 'Unassigned'}</span>
                                    <div className="flex gap-1 shrink-0">
                                      {col.id !== 'TO_DO' && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const prevIdx = ['TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'].indexOf(col.id) - 1;
                                            handleUpdateTaskStatus(task.id, ['TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'][prevIdx]);
                                          }}
                                          className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[8px] font-extrabold"
                                        >
                                          &larr;
                                        </button>
                                      )}
                                      {col.id !== 'COMPLETED' && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const nextIdx = ['TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'].indexOf(col.id) + 1;
                                            handleUpdateTaskStatus(task.id, ['TO_DO', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'][nextIdx]);
                                          }}
                                          className="p-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[8px] font-extrabold"
                                        >
                                          &rarr;
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-tab: SHARED WIKIS / DOCUMENTS */}
                {projectWorkspaceTab === 'docs' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Review project specifications, guidelines, and manuals</span>
                      <button onClick={() => setCreateDocOpen(true)} className={buttonPrimaryClass}>
                        <Plus className="w-4 h-4" /> Create Documentation Wiki
                      </button>
                    </div>

                    <div className="space-y-4">
                      {selectedProject.documents?.map((doc) => (
                        <div key={doc.id} className={`${cardStyleClass} text-xs space-y-3`}>
                          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                            <div>
                              <strong className="text-sm font-bold text-slate-900 dark:text-white font-sora block">{doc.title}</strong>
                              <span className="text-[10px] text-slate-450 mt-0.5 block">Authored by {doc.creator.fullName} &bull; {new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <pre className="whitespace-pre-wrap select-text leading-relaxed font-sans text-slate-700 dark:text-slate-350">{doc.content}</pre>
                        </div>
                      ))}

                      {selectedProject.documents?.length === 0 && (
                        <div className="text-center p-12 text-slate-400 italic text-xs bg-slate-50 dark:bg-slate-950/30 rounded-3xl border border-slate-200 dark:border-slate-800">
                          No wiki pages created yet. Click "Create Documentation Wiki" to write notes.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sub-tab: FILE VAULT */}
                {projectWorkspaceTab === 'files' && (
                  <div className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      
                      {/* Upload Form panel */}
                      <div className={`${cardStyleClass} space-y-4 md:col-span-1`}>
                        <h4 className="text-xs font-bold uppercase tracking-wider">Upload File Asset</h4>
                        <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center text-xs space-y-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/30 transition-colors relative">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="w-6 h-6 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500">Click to browse or drop file here</span>
                          <span className="text-[9px] text-slate-450 block">Max size: 10MB (PDF, ZIP, JPG, PNG, JSON, TXT)</span>
                        </div>

                        {fileToUpload && (
                          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border text-[11px] space-y-2">
                            <span className="font-semibold block truncate">Selected: {fileToUpload.name}</span>
                            <span className="text-slate-450 block">Size: {Math.round(fileToUpload.size / 1024)} KB</span>
                            <button onClick={handleFileUpload} className={`${buttonPrimaryClass} w-full text-center justify-center py-2`}>
                              Verify & Save metadata
                            </button>
                          </div>
                        )}

                        {uploadError && <span className="text-[10px] text-rose-500 font-semibold block">{uploadError}</span>}
                        {uploadSuccess && <span className="text-[10px] text-emerald-500 font-semibold block">✓ Upload successfully simulated!</span>}
                      </div>

                      {/* File Listing table */}
                      <div className={`${cardStyleClass} md:col-span-2 space-y-3`}>
                        <h4 className="text-xs font-bold uppercase tracking-wider">Project Assets List</h4>
                        
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-0.5">
                          {selectedProject.files?.map((file) => (
                            <div key={file.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-xl flex justify-between items-center text-xs">
                              <div>
                                <strong className="text-slate-800 dark:text-white font-bold block truncate max-w-[200px]">{file.name}</strong>
                                <span className="text-[9.5px] text-slate-450 mt-0.5 block uppercase font-bold">
                                  {file.mimeType.split('/')[1]} &bull; {Math.round(file.size / 1024)} KB &bull; Uploader: {file.uploader.fullName}
                                </span>
                              </div>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-indigo-650 dark:text-brand-accent rounded-lg font-bold text-[10px]"
                              >
                                View / Download
                              </a>
                            </div>
                          ))}

                          {selectedProject.files?.length === 0 && (
                            <div className="text-center p-12 text-slate-400 italic text-xs">
                              No file assets shared in this vault yet.
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: CHAT */}
            {activeTab === 'chat' && (
              <div className={`${cardStyleClass} p-0 overflow-hidden flex flex-col h-[550px] bg-slate-50/50 dark:bg-slate-900/40 border`}>
                
                {/* Chat Top Header */}
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-550" />
                    <div>
                      {selectedProject ? (
                        <>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-sora">Project: {selectedProject.title} Chat</h4>
                          <span className="text-[10px] text-slate-450">Broadcast to active project team members</span>
                        </>
                      ) : chatType === 'dm' && dmTargetMember ? (
                        <>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-sora">DM: {dmTargetMember.user.fullName}</h4>
                          <span className="text-[10px] text-slate-450">Private 1-on-1 messaging session</span>
                        </>
                      ) : (
                        <>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight font-sora">{selectedTeam.name} General</h4>
                          <span className="text-[10px] text-slate-450">General discussion board for all squad members</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* DM switcher control */}
                  {chatType === 'dm' && (
                    <button
                      onClick={() => {
                        setChatType('team');
                        setDmTargetMember(null);
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-800 text-[10px] font-bold rounded-lg"
                    >
                      Back to general team chat
                    </button>
                  )}
                </div>

                {/* Messages Canvas */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-100/10 dark:bg-slate-950/10 select-text">
                  {chatMessages.map((msg) => {
                    const isMyMsg = msg.senderId === userData.id;
                    const isAnn = msg.isAnnouncement;
                    
                    return (
                      <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMyMsg ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}>
                        {!isMyMsg && (
                          <div className="w-8 h-8 rounded-lg bg-indigo-550/10 text-brand-primary flex items-center justify-center font-bold shrink-0">
                            {msg.sender.fullName.charAt(0)}
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[9.5px] text-slate-450 justify-start">
                            <span className="font-bold text-slate-700 dark:text-slate-350">{msg.sender.fullName}</span>
                            <span>&bull;</span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMyMsg
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : isAnn
                                ? 'bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-300 rounded-tl-none font-semibold'
                                : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-805 text-slate-800 dark:text-slate-200 rounded-tl-none'
                          }`}>
                            {isAnn && <span className="text-[9px] uppercase tracking-wider block text-amber-500 font-extrabold mb-1">⚠️ Announcement</span>}
                            <span>{msg.content}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input form */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 shrink-0 flex items-center gap-2">
                  {/* Announcement toggle for leaders */}
                  {isLeader && !selectedProject && !dmTargetMember && (
                    <button
                      type="button"
                      onClick={() => setIsAnnouncement(!isAnnouncement)}
                      title="Toggle Announcement style"
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        isAnnouncement
                          ? 'bg-amber-500/10 border-amber-550/30 text-amber-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-950'
                      }`}
                    >
                      Announce
                    </button>
                  )}
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      selectedProject ? "Type a project message... (press Enter)" :
                      dmTargetMember ? `Send direct message to ${dmTargetMember.user.fullName}...` :
                      "Write team message..."
                    }
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-slate-800 dark:text-white text-xs"
                  />

                  <button type="submit" className="p-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: ANALYTICS */}
            {activeTab === 'analytics' && metrics && (
              <div className="space-y-6">
                <h3 className="text-sm font-extrabold text-slate-955 dark:text-white uppercase tracking-wider">Team Performance Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Task Status count chart */}
                  <div className={cardStyleClass}>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-4">Task Sprints Distribution</h4>
                    
                    <div className="h-[200px] w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'To Do', value: metrics.taskStatusCounts?.TO_DO || 0 },
                              { name: 'In Progress', value: metrics.taskStatusCounts?.IN_PROGRESS || 0 },
                              { name: 'Under Review', value: metrics.taskStatusCounts?.UNDER_REVIEW || 0 },
                              { name: 'Completed', value: metrics.taskStatusCounts?.COMPLETED || 0 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {['#94a3b8', '#3b82f6', '#f59e0b', '#10b981'].map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-500 mt-2">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> To Do</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> In Progress</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Review</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed</span>
                    </div>
                  </div>

                  {/* Contributions bar chart */}
                  <div className={cardStyleClass}>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-4">Completed Tasks per Developer</h4>
                    
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.contributions || []}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="completedTasks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Project summaries table */}
                <div className={`${cardStyleClass} p-5 space-y-3`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Project Progress Summary</h4>
                  <div className="space-y-2">
                    {metrics.projectsSummary?.map((p) => (
                      <div key={p.id} className="p-3.5 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-805 rounded-2xl flex justify-between items-center text-xs flex-wrap gap-3">
                        <div>
                          <strong className="text-slate-800 dark:text-white font-bold block">{p.title}</strong>
                          <span className="text-[10px] text-slate-450 block mt-0.5">Tasks: {p.completedTasks}/{p.totalTasks} completed</span>
                        </div>
                        
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-extrabold text-[10px] text-indigo-500">{p.completionPercent}% Complete</span>
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-550" style={{ width: `${p.completionPercent}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {metrics.projectsSummary?.length === 0 && (
                      <span className="text-xs text-slate-400 italic block">No projects running under this team.</span>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* ==========================================
          MODALS & FORM POPUPS
          ========================================== */}
      
      {/* 1. CREATE TEAM MODAL */}
      <AnimatePresence>
        {createTeamOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left"
            >
              <button onClick={() => setCreateTeamOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                <span className="text-xl font-bold">&times;</span>
              </button>

              <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white font-sora leading-tight">Create a Team</h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Establish a workspace group to share projects and collaborate.</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Team Name</label>
                    <input
                      type="text"
                      required
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="e.g. Flight Stability Devs"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Description</label>
                    <textarea
                      value={newTeamDesc}
                      onChange={(e) => setNewTeamDesc(e.target.value)}
                      placeholder="e.g. Designing double-core RTOS drone balancing programs..."
                      rows={3}
                      className={inputClass}
                    />
                  </div>
                </div>

                <button type="submit" className={`${buttonPrimaryClass} w-full text-center justify-center py-3.5`}>
                  Initialize Team Workspace
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. INITIALIZE PROJECT MODAL */}
      <AnimatePresence>
        {createProjectOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left"
            >
              <button onClick={() => setCreateProjectOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                <span className="text-xl font-bold">&times;</span>
              </button>

              <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white font-sora leading-tight">Initialize Project</h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Deploy a new shared code repository project on the hub.</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Project Title</label>
                    <input
                      type="text"
                      required
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="e.g. FreeRTOS drone stability software"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Description</label>
                    <textarea
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      placeholder="Define milestone deliverable outputs..."
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Difficulty</label>
                      <select
                        value={newProjectDiff}
                        onChange={(e) => setNewProjectDiff(e.target.value)}
                        className={inputClass}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Industry-level">Industry-level</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Track</label>
                      <input
                        type="text"
                        value={newProjectTrack}
                        onChange={(e) => setNewProjectTrack(e.target.value)}
                        placeholder="e.g. Embedded, Web, AI"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className={`${buttonPrimaryClass} w-full text-center justify-center py-3`}>
                  Create Collaborative Project
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CREATE TASK TICKET MODAL */}
      <AnimatePresence>
        {createTaskOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left"
            >
              <button onClick={() => setCreateTaskOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                <span className="text-xl font-bold">&times;</span>
              </button>

              <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white font-sora leading-tight">Create Task Ticket</h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Deploy a sprint task to be checked on the Kanban Board.</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Task Title</label>
                    <input
                      type="text"
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g. Implement PID balance loop task"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Description</label>
                    <textarea
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      placeholder="Define task details..."
                      rows={2}
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Priority</label>
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value)}
                        className={inputClass}
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-550 dark:text-slate-400 block">Assignee</label>
                      <select
                        value={newTaskAssignee}
                        onChange={(e) => setNewTaskAssignee(e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Unassigned</option>
                        {selectedTeam.members?.map((m) => (
                          <option key={m.userId} value={m.userId}>{m.user.fullName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Due Date</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <button type="submit" className={`${buttonPrimaryClass} w-full text-center justify-center py-3`}>
                  Deploy Task Ticket
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. TASK DETAILS & COMMENTS SIDEBAR */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-md h-full p-6 sm:p-8 border-l border-slate-200 dark:border-slate-805 shadow-2xl relative text-left flex flex-col justify-between"
            >
              <button onClick={() => setSelectedTask(null)} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 transition-colors">
                <span className="text-xl font-bold">&times;</span>
              </button>

              <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                <div>
                  <span className={`text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    selectedTask.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-550'
                  }`}>
                    {selectedTask.priority} Priority
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-sora mt-2 leading-tight">
                    {selectedTask.title}
                  </h3>
                  <span className="text-[10px] text-slate-450 mt-1 block">Created by {selectedTask.creator?.fullName}</span>
                </div>

                {selectedTask.description && (
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border select-text">
                      {selectedTask.description}
                    </p>
                  </div>
                )}

                {/* Comment thread */}
                <div className="space-y-4">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Activity comments ({taskComments.length})</span>
                  
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto select-text pr-1">
                    {taskComments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5 items-start text-xs">
                        <div className="w-7 h-7 rounded-lg bg-indigo-550/15 text-brand-primary flex items-center justify-center font-bold shrink-0">
                          {comment.user.fullName.charAt(0)}
                        </div>
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-805 rounded-xl flex-1">
                          <div className="flex justify-between items-center text-[9px] text-slate-450 mb-1">
                            <strong className="text-slate-700 dark:text-slate-300 font-bold">{comment.user.fullName}</strong>
                            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-655 dark:text-slate-350 leading-normal">{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    {taskComments.length === 0 && (
                      <span className="text-xs text-slate-450 italic block text-center py-2">No activity comments posted yet.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="pt-4 border-t border-slate-200 dark:border-slate-800/80 shrink-0 flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Post an updates comment..."
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-slate-850 dark:text-white text-xs"
                />
                <button type="submit" className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl">
                  Post
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CREATE DOCUMENT WIKI MODAL */}
      <AnimatePresence>
        {createDocOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-darknavy-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-250 dark:border-slate-805 shadow-xl relative text-left"
            >
              <button onClick={() => setCreateDocOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-450 transition-colors">
                <span className="text-xl font-bold">&times;</span>
              </button>

              <form onSubmit={handleCreateDocSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950 dark:text-white font-sora leading-tight">Create Documentation Wiki</h3>
                  <span className="text-[10px] text-slate-500 mt-1 block">Write specifications, manuals, or checklist details.</span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Wiki Title</label>
                    <input
                      type="text"
                      required
                      value={newDocTitle}
                      onChange={(e) => setNewDocTitle(e.target.value)}
                      placeholder="e.g. FreeRTOS Task Synchronization Specs"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-550 dark:text-slate-400 block">Content details</label>
                    <textarea
                      required
                      value={newDocContent}
                      onChange={(e) => setNewDocContent(e.target.value)}
                      placeholder="Write notes (supports plain text details and lists)..."
                      rows={8}
                      className={inputClass}
                    />
                  </div>
                </div>

                <button type="submit" className={`${buttonPrimaryClass} w-full text-center justify-center py-3`}>
                  Save Wiki Document
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
