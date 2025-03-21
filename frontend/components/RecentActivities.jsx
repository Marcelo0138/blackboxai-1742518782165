import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import Link from 'next/link';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const { user } = useStore();

  useEffect(() => {
    // In a real application, this would fetch from an API
    // For now, we'll use mock data
    const mockActivities = [
      {
        id: 1,
        type: 'task_created',
        user: {
          name: 'João Silva',
          avatar: 'https://via.placeholder.com/40'
        },
        project: {
          id: '1',
          name: 'Projeto Website'
        },
        task: {
          id: '1',
          title: 'Implementar autenticação'
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
      },
      {
        id: 2,
        type: 'task_completed',
        user: {
          name: 'Maria Santos',
          avatar: 'https://via.placeholder.com/40'
        },
        project: {
          id: '1',
          name: 'Projeto Website'
        },
        task: {
          id: '2',
          title: 'Design da página inicial'
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
      },
      {
        id: 3,
        type: 'comment_added',
        user: {
          name: 'Pedro Oliveira',
          avatar: 'https://via.placeholder.com/40'
        },
        project: {
          id: '1',
          name: 'Projeto Website'
        },
        task: {
          id: '1',
          title: 'Implementar autenticação'
        },
        comment: 'Adicionei a integração com Google OAuth',
        timestamp: new Date(Date.now() - 1000 * 60 * 90) // 1.5 hours ago
      }
    ];

    setActivities(mockActivities);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'task_completed':
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'comment_added':
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case 'task_created':
        return (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{activity.user.name}</span> criou a tarefa{' '}
            <Link href={`/tasks/${activity.task.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {activity.task.title}
            </Link>{' '}
            no projeto{' '}
            <Link href={`/projects/${activity.project.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {activity.project.name}
            </Link>
          </p>
        );
      case 'task_completed':
        return (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{activity.user.name}</span> concluiu a tarefa{' '}
            <Link href={`/tasks/${activity.task.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {activity.task.title}
            </Link>
          </p>
        );
      case 'comment_added':
        return (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-medium">{activity.user.name}</span> comentou na tarefa{' '}
              <Link href={`/tasks/${activity.task.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                {activity.task.title}
              </Link>
            </p>
            <p className="mt-1 text-gray-600 dark:text-gray-400 italic">"{activity.comment}"</p>
          </div>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} dia${days > 1 ? 's' : ''} atrás`;
    }
    if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    }
    if (minutes > 0) {
      return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    }
    return 'Agora mesmo';
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {index !== activities.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {getActivityMessage(activity)}
                    <span className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Nenhuma atividade recente
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            As atividades aparecerão aqui quando você começar a trabalhar nos projetos.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;