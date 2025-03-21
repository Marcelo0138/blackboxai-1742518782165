import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '../store/useStore';

const Sidebar = ({ isOpen }) => {
  const router = useRouter();
  const { user } = useStore();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // Navigation items
  const navigation = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
          />
        </svg>
      ),
      href: '/dashboard'
    },
    {
      name: 'Projetos',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
          />
        </svg>
      ),
      href: '/projects',
      submenu: [
        { name: 'Todos os Projetos', href: '/projects' },
        { name: 'Novo Projeto', href: '/projects/new' },
        { name: 'Arquivados', href: '/projects/archived' }
      ]
    },
    {
      name: 'Tarefas',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
          />
        </svg>
      ),
      href: '/tasks',
      submenu: [
        { name: 'Minhas Tarefas', href: '/tasks' },
        { name: 'Nova Tarefa', href: '/tasks/new' },
        { name: 'Calendário', href: '/tasks/calendar' }
      ]
    },
    {
      name: 'Equipe',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ),
      href: '/team',
      submenu: [
        { name: 'Membros', href: '/team' },
        { name: 'Convites', href: '/team/invites' }
      ]
    },
    {
      name: 'Relatórios',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
          />
        </svg>
      ),
      href: '/reports'
    }
  ];

  // Only show admin section if user is admin
  if (user?.role === 'Administrador') {
    navigation.push({
      name: 'Administração',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '/admin',
      submenu: [
        { name: 'Usuários', href: '/admin/users' },
        { name: 'Configurações', href: '/admin/settings' },
        { name: 'Logs', href: '/admin/logs' }
      ]
    });
  }

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="h-full flex flex-col">
        {/* User info */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={user?.avatar || 'https://via.placeholder.com/40'}
              alt={user?.name}
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item, index) => (
              <li key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg ${
                        router.pathname.startsWith(item.href)
                          ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          activeSubmenu === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeSubmenu === index && (
                      <ul className="mt-1 pl-8 space-y-1">
                        {item.submenu.map((subitem) => (
                          <li key={subitem.name}>
                            <Link href={subitem.href}
                              className={`block p-2 rounded-lg ${
                                router.pathname === subitem.href
                                  ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              {subitem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link href={item.href}
                    className={`flex items-center p-2 rounded-lg ${
                      router.pathname === item.href
                        ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700">
          <Link href="/help"
            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span className="ml-3">Ajuda</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;