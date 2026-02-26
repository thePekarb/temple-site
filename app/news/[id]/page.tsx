'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminEditBtn from '@/components/AdminEditBtn';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

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
          <div className="mb-10 relative group">
            {allImages.length === 1 ? (
              <div
                className="rounded-xl overflow-hidden bg-gray-50 cursor-pointer border border-gray-100"
                onClick={() => setFullscreenImage(allImages[0])}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={allImages[0]}
                  alt={newsItem.title}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation={{
                    nextEl: '.news-next',
                    prevEl: '.news-prev',
                  }}
                  pagination={{ clickable: true }}
                  className="rounded-xl border border-gray-100 bg-gray-50"
                >
                  {allImages.map((url, i) => (
                    <SwiperSlide key={i} className="cursor-pointer" onClick={() => setFullscreenImage(url)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`${newsItem.title} - фото ${i + 1}`}
                        className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom arrows */}
                <button className="news-prev absolute top-1/2 -left-4 md:-left-6 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#762121] hover:bg-[#F5EFE0] transition -translate-y-1/2 opacity-0 group-hover:opacity-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button className="news-next absolute top-1/2 -right-4 md:-right-6 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#762121] hover:bg-[#F5EFE0] transition -translate-y-1/2 opacity-0 group-hover:opacity-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
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

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition z-50 cursor-pointer"
            onClick={() => setFullscreenImage(null)}
          >
            ✕
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fullscreenImage}
            alt="Полноэкранное фото"
            className="max-w-full max-h-screen object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}