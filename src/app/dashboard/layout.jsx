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
    <div className="flex h-screen bg-gray-900 text-gray-300 font-roboto">
      <nav
        className={`bg-gray-800 shadow-lg flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <Link href="/dashboard/clientes"><h1 className="text-2xl font-bold text-center text-blue-400">Dashboard</h1></Link>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <ul className="flex-grow mt-4">
          <li>
            <Link
              href="/dashboard/clientes"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-500 ${
                pathname === '/dashboard/clientes' ? 'bg-blue-500' : ''
              }`}
            >
              <FontAwesomeIcon icon={faUser} className="mr-3 text-white size-7" />
              {isSidebarOpen && 'Clientes'}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/proyectos"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-500 ${
                pathname === '/dashboard/proyectos' ? 'bg-blue-500' : ''
              }`}
            >
              <FontAwesomeIcon icon={faChartBar} className="mr-3 text-white size-7" />
              {isSidebarOpen && 'Proyectos'}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/deliverynotes"
              className={`flex items-center px-4 py-3 rounded-lg hover:bg-blue-500 ${
                pathname === '/dashboard/deliverynotes' ? 'bg-blue-500' : ''
              }`}
            >
              <FontAwesomeIcon icon={faBell} className="mr-3 text-white size-7" />
              {isSidebarOpen && 'Albaranes'}
            </Link>
          </li>
        </ul>
        {user && isSidebarOpen && (
          <div className="p-4 border-t border-gray-700">
            <p className="text-sm">Bienvenido:</p>
            <p className="text-lg font-semibold text-white">
              {user.name} {user.surnames}
            </p>
            <button
              onClick={handleLogout}
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
      <main className="flex-grow">{children}</main>
    </div>
  );
}
