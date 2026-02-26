'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminEditBtn from '@/components/AdminEditBtn';
import { useRouter } from 'next/navigation';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  image_url: string;
  image_urls?: string[];
  published_date: string;
}

export default function NewsDetail() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchOneNews() {
      if (!id) return;

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) {
        setNewsItem(data);
      }
      setLoading(false);
    }
    fetchOneNews();
  }, [id]);

  if (loading) return <div className="text-center pt-32 text-gray-500">Загрузка...</div>;
  if (!newsItem) return <div className="text-center pt-32 text-red-500">Новость не найдена</div>;

  // Collect all images: prefer image_urls, fallback to image_url
  const allImages: string[] = (newsItem.image_urls && newsItem.image_urls.length > 0)
    ? newsItem.image_urls
    : (newsItem.image_url ? [newsItem.image_url] : []);

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

        {/* Photo gallery */}
        {allImages.length > 0 && (
          <div className="mb-8">
            {/* Main image */}
            <div className="rounded-xl overflow-hidden max-h-[500px] mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allImages[activeImage]}
                alt={newsItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails (only if more than 1 image) */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition ${i === activeImage ? 'border-[#C5A059] shadow-md' : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Фото ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="prose prose-lg text-gray-800 leading-relaxed">
          {newsItem.content ? (
            <p style={{ whiteSpace: 'pre-line' }}>{newsItem.content}</p>
          ) : (
            <p>{newsItem.description}</p>
          )}
        </div>
      </article>
    </main>
  );
}