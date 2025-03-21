import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProjectProgress = ({ projects }) => {
  // Prepare data for the chart
  const chartData = projects
    .filter(project => project.status !== 'Arquivado')
    .map(project => ({
      name: project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name,
      progresso: project.progress,
      tarefas: project.tasks.length,
      color: getStatusColor(project.status)
    }))
    .sort((a, b) => b.progresso - a.progresso)
    .slice(0, 5); // Show only top 5 projects

  function getStatusColor(status) {
    switch (status) {
      case 'Em Andamento':
        return '#3B82F6';
      case 'Concluído':
        return '#10B981';
      default:
        return '#6B7280';
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Progresso: {payload[0].value}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Tarefas: {payload[0].payload.tarefas}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {projects.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis
                className="text-gray-600 dark:text-gray-400"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="progresso"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Nenhum projeto encontrado.
            <br />
            Crie um novo projeto para começar.
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Em Andamento</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-sm mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Concluído</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Projetos em Andamento
          </h4>
          <p className="mt-2 text-2xl font-semibold text-blue-700 dark:text-blue-300">
            {projects.filter(p => p.status === 'Em Andamento').length}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400">
            Projetos Concluídos
          </h4>
          <p className="mt-2 text-2xl font-semibold text-green-700 dark:text-green-300">
            {projects.filter(p => p.status === 'Concluído').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;