'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Ошибка: ' + error.message);
    } else {
      router.push('/news'); // Перекидываем в новости
      router.refresh(); // Обновляем, чтобы появились карандаши
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FCFAF7] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-[#C5A059]/20">
        <h1 className="text-3xl font-serif font-bold text-[#762121] mb-6 text-center">Вход для настоятеля</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:border-[#C5A059]"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:border-[#C5A059]"
            required
          />
          <button 
            disabled={loading}
            className="w-full bg-[#762121] text-white p-3 rounded-lg hover:bg-[#C5A059] transition"
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </main>
  );
}