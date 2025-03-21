import create from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useStore = create((set, get) => ({
  // Auth State
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Projects State
  projects: [],
  currentProject: null,
  projectsLoading: false,
  projectError: null,

  // Tasks State
  tasks: [],
  currentTask: null,
  tasksLoading: false,
  taskError: null,

  // Auth Actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, ...user } = response.data.data;
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erro ao fazer login',
        isLoading: false
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, ...user } = response.data.data;
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.error || 'Erro ao registrar',
        isLoading: false
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      isAuthenticated: false,
      projects: [],
      currentProject: null,
      tasks: [],
      currentTask: null
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get('/api/auth/me');
      set({ user: response.data.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    }
  },

  // Project Actions
  fetchProjects: async () => {
    set({ projectsLoading: true, projectError: null });
    try {
      const response = await api.get('/api/projects');
      set({ projects: response.data.data, projectsLoading: false });
    } catch (error) {
      set({
        projectError: error.response?.data?.error || 'Erro ao carregar projetos',
        projectsLoading: false
      });
    }
  },

  createProject: async (projectData) => {
    set({ projectsLoading: true, projectError: null });
    try {
      const response = await api.post('/api/projects', projectData);
      set(state => ({
        projects: [...state.projects, response.data.data],
        projectsLoading: false
      }));
      return response.data.data;
    } catch (error) {
      set({
        projectError: error.response?.data?.error || 'Erro ao criar projeto',
        projectsLoading: false
      });
      return null;
    }
  },

  updateProject: async (projectId, projectData) => {
    set({ projectsLoading: true, projectError: null });
    try {
      const response = await api.put(`/api/projects/${projectId}`, projectData);
      set(state => ({
        projects: state.projects.map(project =>
          project._id === projectId ? response.data.data : project
        ),
        currentProject: state.currentProject?._id === projectId
          ? response.data.data
          : state.currentProject,
        projectsLoading: false
      }));
      return response.data.data;
    } catch (error) {
      set({
        projectError: error.response?.data?.error || 'Erro ao atualizar projeto',
        projectsLoading: false
      });
      return null;
    }
  },

  // Task Actions
  fetchTasks: async (projectId) => {
    set({ tasksLoading: true, taskError: null });
    try {
      const response = await api.get(`/api/projects/${projectId}/tasks`);
      set({ tasks: response.data.data, tasksLoading: false });
    } catch (error) {
      set({
        taskError: error.response?.data?.error || 'Erro ao carregar tarefas',
        tasksLoading: false
      });
    }
  },

  createTask: async (projectId, taskData) => {
    set({ tasksLoading: true, taskError: null });
    try {
      const response = await api.post(`/api/projects/${projectId}/tasks`, taskData);
      set(state => ({
        tasks: [...state.tasks, response.data.data],
        tasksLoading: false
      }));
      return response.data.data;
    } catch (error) {
      set({
        taskError: error.response?.data?.error || 'Erro ao criar tarefa',
        tasksLoading: false
      });
      return null;
    }
  },

  updateTask: async (taskId, taskData) => {
    set({ tasksLoading: true, taskError: null });
    try {
      const response = await api.put(`/api/tasks/${taskId}`, taskData);
      set(state => ({
        tasks: state.tasks.map(task =>
          task._id === taskId ? response.data.data : task
        ),
        currentTask: state.currentTask?._id === taskId
          ? response.data.data
          : state.currentTask,
        tasksLoading: false
      }));
      return response.data.data;
    } catch (error) {
      set({
        taskError: error.response?.data?.error || 'Erro ao atualizar tarefa',
        tasksLoading: false
      });
      return null;
    }
  },

  reorderTasks: async (projectId, tasks) => {
    try {
      const response = await api.put(`/api/projects/${projectId}/tasks/reorder`, {
        tasks
      });
      set({ tasks: response.data.data });
      return true;
    } catch (error) {
      set({
        taskError: error.response?.data?.error || 'Erro ao reordenar tarefas'
      });
      return false;
    }
  },

  // Comment Actions
  addComment: async (taskId, content) => {
    try {
      const response = await api.post(`/api/tasks/${taskId}/comments`, {
        content
      });
      set(state => ({
        currentTask: {
          ...state.currentTask,
          comments: [...state.currentTask.comments, response.data.data]
        }
      }));
      return response.data.data;
    } catch (error) {
      set({
        taskError: error.response?.data?.error || 'Erro ao adicionar comentário'
      });
      return null;
    }
  }
}));

export { useStore, api };