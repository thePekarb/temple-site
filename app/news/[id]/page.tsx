'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase'; // Импортируем наш клиент
import Link from 'next/link';
import { useParams } from 'next/navigation'; // Чтобы узнать ID из адреса
import AdminEditBtn from '@/components/AdminEditBtn';
import { useRouter } from 'next/navigation'; // понадобится для обновления

interface NewsItem {
  id: number;
  title: string;
  description: string; // В будущем заменим на content (полный текст)
  image_url: string;
  published_date: string;
}

export default function NewsDetail() {
  const { id } = useParams(); // Берем ID из ссылки
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOneNews() {
      if (!id) return;

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id) // Ищем новость с таким ID
        .single();    // Берем только одну запись

      if (!error) {
        setNewsItem(data);
      }
      setLoading(false);
    }
    fetchOneNews();
  }, [id]);

  if (loading) return <div className="text-center pt-32 text-gray-500">Загрузка...</div>;
  if (!newsItem) return <div className="text-center pt-32 text-red-500">Новость не найдена</div>;

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto">
      <Link href="/news" className="text-[#C5A059] hover:underline mb-6 block">← Назад к новостям</Link>
      
      <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#762121] mb-4 leading-tight">
          {newsItem.title}
        </h1>
        
        <p className="text-gray-400 text-sm mb-6 uppercase tracking-widest font-bold">
          Опубликовано: {newsItem.published_date}
        </p>

        {newsItem.image_url && (
          <div className="rounded-xl overflow-hidden mb-8 max-h-[500px]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={newsItem.image_url} alt={newsItem.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg text-gray-800 leading-relaxed">
          {/* Пока выводим description, позже сделаем большое поле content */}
          <p>{newsItem.description}</p> 
          <p>
            Здесь будет полный текст новости, который мы сможем редактировать через админку. 
            Пока здесь текст-заглушка, чтобы показать, как выглядит страница.
          </p>
        </div>
      </article>
    </main>
  );
}