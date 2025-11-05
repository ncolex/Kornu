import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace(`/login?from=${router.asPath}`);
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return children;
};

export default PrivateRoute;