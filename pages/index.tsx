import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeartIcon from '../components/icons/HeartIcon';
import SearchIcon from '../components/icons/SearchIcon';

const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push({
        pathname: '/results/[query]',
        query: { query: encodeURIComponent(query.trim()) }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Kornu - Social Reputation Index</title>
        <meta name="description" content="Verify the reputation of partners, friends, and more" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center text-center -mt-8 min-h-[70vh]">
          <HeartIcon className="w-24 h-24 text-pink-500 mb-4 animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-200 mb-2">Kornu</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            Verifica la reputación de novios, parejas, ex, o amigos antes de que sea tarde.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-lg">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca por usuario de Instagram, nombre o teléfono"
                className="w-full pl-5 pr-14 py-4 text-lg border-2 border-pink-200 rounded-full shadow-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-pink-500 dark:focus:border-pink-500"
              />
              <button 
                type="submit" 
                className="absolute inset-y-0 right-0 flex items-center justify-center w-14 h-full text-pink-500 hover:text-pink-700"
                aria-label="Verify"
              >
                <SearchIcon className="w-7 h-7" />
              </button>
            </div>
          </form>
          <button 
            onClick={handleSearch}
            disabled={!query.trim()}
            className="mt-6 px-12 py-4 text-xl font-bold text-white bg-pink-500 rounded-full shadow-lg hover:bg-pink-600 transform hover:scale-105 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-wait flex items-center justify-center"
          >
            VERIFY
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
