import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HeartIcon from './icons/HeartIcon';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();



  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50 dark:bg-gray-800/80 dark:border-b dark:border-gray-700">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-pink-500">
          <HeartIcon className="w-8 h-8"/>
          <span>CornuScore</span>
        </Link>
        <ul className="flex items-center gap-2 md:gap-4 font-semibold text-gray-700 dark:text-gray-300">
          <li>
            <Link href="/" className={`hover:text-pink-500 ${router.pathname === '/' ? 'text-pink-500 underline' : ''}`}>
              Verify
            </Link>
          </li>
          <li>
            <Link href="/review" className={`hover:text-pink-500 ${router.pathname === '/review' ? 'text-pink-500 underline' : ''}`}>
              Report
            </Link>
          </li>
          <li>
            <Link href="/ranking" className={`hover:text-pink-500 ${router.pathname === '/ranking' ? 'text-pink-500 underline' : ''}`}>
              Ranking
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/profile" className={`hover:text-pink-500 ${router.pathname === '/profile' ? 'text-pink-500 underline' : ''}`}>
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="font-semibold text-gray-700 hover:text-pink-500 dark:text-gray-300 dark:hover:text-pink-500">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className={`hover:text-pink-500 ${router.pathname === '/login' ? 'text-pink-500 underline' : ''}`}>
                Login
              </Link>
            </li>
          )}
           <li>
            <NotificationBell />
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
