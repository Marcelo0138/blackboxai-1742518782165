const Badge = ({ type, children, size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-0.5 text-base'
  };

  const typeClasses = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  };

  // Status-specific badges
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    inProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    onHold: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };

  // Priority-specific badges
  const priorityClasses = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    urgent: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };

  const getTypeClass = () => {
    if (typeClasses[type]) return typeClasses[type];
    if (statusClasses[type]) return statusClasses[type];
    if (priorityClasses[type]) return priorityClasses[type];
    return typeClasses.gray; // default
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${getTypeClass()} ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, size }) => {
  const statusMap = {
    pending: 'Pendente',
    inProgress: 'Em Andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    onHold: 'Em Espera'
  };

  return (
    <Badge type={status} size={size}>
      {statusMap[status] || status}
    </Badge>
  );
};

export const PriorityBadge = ({ priority, size }) => {
  const priorityMap = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente'
  };

  const PriorityIcon = ({ priority }) => {
    const iconClasses = {
      low: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      high: 'text-red-600 dark:text-red-400',
      urgent: 'text-purple-600 dark:text-purple-400'
    };

    return (
      <svg
        className={`w-3 h-3 mr-1 ${iconClasses[priority]}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {priority === 'urgent' ? (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
            clipRule="evenodd"
          />
        )}
      </svg>
    );
  };

  return (
    <Badge type={priority} size={size}>
      <PriorityIcon priority={priority} />
      {priorityMap[priority] || priority}
    </Badge>
  );
};

export const RoleBadge = ({ role, size }) => {
  const roleMap = {
    admin: 'Administrador',
    manager: 'Gerente',
    member: 'Membro',
    viewer: 'Visualizador'
  };

  const roleTypes = {
    admin: 'purple',
    manager: 'blue',
    member: 'green',
    viewer: 'gray'
  };

  return (
    <Badge type={roleTypes[role] || 'gray'} size={size}>
      {roleMap[role] || role}
    </Badge>
  );
};

export const NotificationBadge = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default Badge;