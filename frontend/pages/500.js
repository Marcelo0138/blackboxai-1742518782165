import Link from 'next/link';
import { useStore } from '../store/useStore';

const Custom500 = () => {
  const { isAuthenticated } = useStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-red-600 dark:text-red-400 sm:text-5xl">500</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 dark:sm:border-gray-700 sm:pl-6">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
                Erro no servidor
              </h1>
              <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando na solução.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link
                href={isAuthenticated ? '/dashboard' : '/'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isAuthenticated ? 'Voltar ao Dashboard' : 'Ir para Home'}
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Tentar novamente
              </button>
            </div>
          </div>
        </main>

        {/* Technical details (only shown in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 sm:ml-12">
            <details className="text-sm text-gray-500 dark:text-gray-400">
              <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                Detalhes técnicos
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto">
                {`Error: Internal Server Error
Stack: ...
Request: ...
`}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[calc(50%-4rem)] top-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
          <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 opacity-20" 
            style={{
              clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)'
            }}
          />
        </div>
      </div>

      {/* Support contact */}
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Se o problema persistir, entre em contato com nosso suporte:{' '}
          <a
            href="mailto:suporte@taskmanager.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            suporte@taskmanager.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Custom500;