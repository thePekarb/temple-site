'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setIsAdmin(true);
    };
    checkUser();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    router.push('/');
    window.location.reload();
  };

  const menuItems = [
    { name: 'Новости', path: '/news' },
    { name: 'Расписание', path: '/schedule' },
    { name: 'История', path: '/history' },
    { name: 'Деятельность', path: '/social' },
    { name: 'Галерея', path: '/gallery' },
    { name: 'Контакты', path: '/contacts' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
          ? 'bg-[#FCFAF7]/95 backdrop-blur-lg shadow-lg shadow-black/5 border-b border-[#C5A059]/20'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Логотип с крестом */}
        <Link href="/" className="flex items-center gap-3 z-50 relative group">
          {/* Православный крест SVG */}
          <svg
            width="24" height="32" viewBox="0 0 24 32" fill="none"
            className={`transition-colors duration-500 ${scrolled ? 'text-[#C5A059]' : 'text-[#C5A059]'}`}
          >
            {/* Верхняя перекладина */}
            <line x1="7" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Вертикальная */}
            <line x1="12" y1="0" x2="12" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Средняя перекладина */}
            <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Нижняя (наклонная) */}
            <line x1="7" y1="24" x2="17" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <div className={`transition-colors duration-500 ${scrolled ? 'text-[#762121]' : 'text-white'}`}>
            <span className="text-lg md:text-xl font-serif font-bold leading-tight block">
              Церковь <br className="md:hidden" />Иоанна Богослова
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`relative text-sm font-medium uppercase tracking-wider transition-colors duration-300
                ${scrolled ? 'text-[#1F1F1F] hover:text-[#C5A059]' : 'text-white/80 hover:text-white'}
                after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0
                after:bg-[#C5A059] after:transition-all after:duration-300 hover:after:w-full
              `}
            >
              {item.name}
            </Link>
          ))}

          {isAdmin && (
            <button
              onClick={handleLogout}
              className="px-4 py-1 text-xs font-bold text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition"
            >
              Выйти
            </button>
          )}
        </nav>

        {/* Mobile Burger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
        >
          <motion.span
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className={`w-8 h-0.5 block transition-colors ${isOpen || scrolled ? 'bg-[#762121]' : 'bg-white'}`}
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className={`w-8 h-0.5 block transition-colors ${isOpen || scrolled ? 'bg-[#762121]' : 'bg-white'}`}
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className={`w-8 h-0.5 block transition-colors ${isOpen || scrolled ? 'bg-[#762121]' : 'bg-white'}`}
          />
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full h-screen bg-[#FCFAF7] flex flex-col items-center justify-center space-y-8 md:hidden shadow-xl"
            >
              {/* Крест в меню */}
              <svg width="32" height="42" viewBox="0 0 24 32" fill="none" className="text-[#C5A059] mb-4 animate-glow">
                <line x1="7" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="0" x2="12" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="7" y1="24" x2="17" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>

              {menuItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-serif font-bold text-[#762121] hover:text-[#C5A059] transition"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {isAdmin && (
                <button onClick={handleLogout} className="text-xl text-red-600 font-bold mt-4">
                  Выйти из админки
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}