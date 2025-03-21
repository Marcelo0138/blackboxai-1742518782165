import Link from 'next/link';
import { LoadingSkeleton } from './Loading';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export const ProjectCard = ({ project, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardBody>
          <LoadingSkeleton className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </LoadingSkeleton>
        </CardBody>
      </Card>
    );
  }

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-600 dark:bg-green-500';
    if (progress >= 50) return 'bg-blue-600 dark:bg-blue-500';
    if (progress >= 25) return 'bg-yellow-600 dark:bg-yellow-500';
    return 'bg-red-600 dark:bg-red-500';
  };

  return (
    <Link href={`/projects/${project._id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardBody>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {project.name}
            </h4>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {project.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {project.description}
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Progresso</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {project.progress}%
              </span>
            </div>
            <div className="mt-2 relative">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div
                  style={{ width: `${project.progress}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor(
                    project.progress
                  )}`}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map((member, index) => (
                <img
                  key={member._id}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                  alt={member.name}
                />
              ))}
              {project.members.length > 3 && (
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    +{project.members.length - 3}
                  </span>
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {project.tasks.length} tarefas
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

export const TaskCard = ({ task, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardBody>
          <LoadingSkeleton className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </LoadingSkeleton>
        </CardBody>
      </Card>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      urgent: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[priority.toLowerCase()] || colors.medium;
  };

  return (
    <Link href={`/tasks/${task._id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardBody>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {task.title}
            </h4>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {task.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              {task.assignedTo.map((user, index) => (
                <img
                  key={user._id}
                  className={`h-8 w-8 rounded-full ${index > 0 ? '-ml-2' : ''} ring-2 ring-white dark:ring-gray-800`}
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(task.deadline).toLocaleDateString()}
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

export default Card;