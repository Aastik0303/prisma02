# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS frontend-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM frontend-deps AS frontend-build
WORKDIR /app
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_RESUME_API_BASE_URL=/api/resume
ARG VITE_WS_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_RESUME_API_BASE_URL=$VITE_RESUME_API_BASE_URL
ENV VITE_WS_BASE_URL=$VITE_WS_BASE_URL
COPY index.html admin.html vite.config.js vite.admin.config.js tailwind.config.js postcss.config.js eslint.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM nginx:1.27-alpine AS frontend-runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
