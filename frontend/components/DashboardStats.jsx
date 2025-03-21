const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total de Projetos',
      value: stats.totalProjects,
      icon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
          />
        </svg>
      ),
      bgColor: 'bg-blue-50 dark:bg-blue-900/50',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Projetos Ativos',
      value: stats.activeProjects,
      icon: (
        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      ),
      bgColor: 'bg-green-50 dark:bg-green-900/50',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Projetos Concluídos',
      value: stats.completedProjects,
      icon: (
        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
          />
        </svg>
      ),
      bgColor: 'bg-purple-50 dark:bg-purple-900/50',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Total de Tarefas',
      value: stats.totalTasks,
      icon: (
        <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
      ),
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/50',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Tarefas Pendentes',
      value: stats.pendingTasks,
      icon: (
        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      ),
      bgColor: 'bg-red-50 dark:bg-red-900/50',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: 'Tarefas Concluídas',
      value: stats.completedTasks,
      icon: (
        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      ),
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/50',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} overflow-hidden rounded-lg shadow`}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </dt>
                  <dd>
                    <div className={`text-lg font-medium ${stat.textColor}`}>
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className={`bg-gray-50 dark:bg-gray-800 px-5 py-3`}>
            <div className="text-sm">
              <a
                href="#"
                className={`font-medium ${stat.textColor} hover:opacity-75 transition-opacity`}
              >
                Ver detalhes
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;