'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChartBar, faBell, faBars } from '@fortawesome/free-solid-svg-icons';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        router.push('/account/login');
        return;
      }

      try {
        const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          router.push('/account/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/account/login');
      }
    };

    fetchUser();
  }, [token, router]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    router.push('/account/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-roboto">
      <nav
        className={`bg-gradient-to-b from-blue-600 via-blue-500 to-blue-700 shadow-lg flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && (
            <Link href="/dashboard/clientes">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition-all"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <ul className="flex-grow mt-4 space-y-2">
          <li>
            <Link
              href="/dashboard/clientes"
              className={`flex items-center px-4 py-3 rounded-lg text-white hover:bg-blue-400 ${
                pathname === '/dashboard/clientes' ? 'bg-blue-500' : ''
              }`}
            >
              <FontAwesomeIcon icon={faUser} className="mr-3" />
              {isSidebarOpen && 'Clientes'}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/proyectos"
              className={`flex items-center px-4 py-3 rounded-lg text-white hover:bg-blue-400 ${
                pathname === '/dashboard/proyectos' ? 'bg-blue-500' : ''
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-3" />
              {isSidebarOpen && 'Proyectos'}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/deliverynotes"
              className={`flex items-center px-4 py-3 rounded-lg text-white hover:bg-blue-400 ${
                pathname === '/dashboard/deliverynotes' ? 'bg-blue-500' : ''
              }`}
            >
              <FontAwesomeIcon icon={faBell} className="mr-3" />
              {isSidebarOpen && 'Albaranes'}
            </Link>
          </li>
        </ul>
        {user && (
          <div
            className={`p-4 border-t border-blue-700 text-white transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <p className="text-sm">Bienvenido:</p>
            <p className="text-lg font-semibold">{user.name} {user.surnames}</p>
            <button
              onClick={handleLogout}
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
      <main className="flex-grow bg-gradient-to-br from-blue-500 via-white to-blue-700 overflow-auto">
        {children}
      </main>
    </div>
  );
}
