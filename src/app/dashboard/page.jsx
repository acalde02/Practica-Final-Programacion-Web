'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        router.push('/account/login'); // Redirigir si no hay token
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
          console.log('User data:', data); // Opcional: Muestra los datos del usuario en la consola
          router.push('/dashboard/clientes'); // Redirigir al dashboard de clientes si hay datos
        } else {
          console.error('Failed to fetch user data');
          router.push('/account/login'); // Redirigir si el fetch falla
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/account/login'); // Redirigir si hay error
      }
    };

    fetchUser();
  }, [router, token]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <p className="text-lg">Redirecting...</p>
    </div>
  );
}
