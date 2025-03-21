import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import Layout from '../components/Layout';
import DashboardStats from '../components/DashboardStats';
import TaskCalendar from '../components/TaskCalendar';
import ProjectProgress from '../components/ProjectProgress';
import RecentActivities from '../components/RecentActivities';

const Dashboard = () => {
  const { user, projects, tasks, fetchProjects, fetchTasks } = useStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Calculate dashboard statistics
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'Em Andamento').length,
    completedProjects: projects.filter(p => p.status === 'Concluído').length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter(t => t.status === 'Pendente').length,
    completedTasks: tasks.filter(t => t.status === 'Concluída').length
  };

  return (
    <Layout>
      <div className="py-6">
        {/* Welcome Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Aqui está um resumo das suas atividades e projetos
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Stats Cards */}
          <div className="mt-8">
            <DashboardStats stats={stats} />
          </div>

          {/* Main Content Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Calendar Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Calendário de Tarefas
                </h2>
                <TaskCalendar tasks={tasks} />
              </div>
            </div>

            {/* Project Progress Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Progresso dos Projetos
                </h2>
                <ProjectProgress projects={projects} />
              </div>
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Atividades Recentes
                </h2>
                <RecentActivities />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => router.push('/projects/new')}
              className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/70 transition-colors"
            >
              <div className="flex items-center">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="ml-3 text-sm font-medium text-blue-700 dark:text-blue-300">
                  Novo Projeto
                </span>
              </div>
            </button>

            <button
              onClick={() => router.push('/tasks/new')}
              className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/70 transition-colors"
            >
              <div className="flex items-center">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="ml-3 text-sm font-medium text-green-700 dark:text-green-300">
                  Nova Tarefa
                </span>
              </div>
            </button>

            <button
              onClick={() => router.push('/team/invites')}
              className="p-4 bg-purple-50 dark:bg-purple-900/50 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/70 transition-colors"
            >
              <div className="flex items-center">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="ml-3 text-sm font-medium text-purple-700 dark:text-purple-300">
                  Convidar Membro
                </span>
              </div>
            </button>

            <button
              onClick={() => router.push('/reports')}
              className="p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/70 transition-colors"
            >
              <div className="flex items-center">
                <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="ml-3 text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Relatórios
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;