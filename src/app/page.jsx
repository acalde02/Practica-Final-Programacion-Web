'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const router = useRouter(); 

  // Usamos useEffect para redirigir a la página de clientes
  React.useEffect(() => {
    router.push('/dashboard/clientes');
  }, [router]); 

  return null; 
}
