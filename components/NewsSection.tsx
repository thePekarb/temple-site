'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  image_urls?: string[];
  published_date: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchLatestNews() {
      // Берем 6 последних
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false })
        .limit(6);
      if (data) setNews(data);
    }
    fetchLatestNews();
  }, []);

  if (news.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-end mb-8 border-b border-[#C5A059]/30 pb-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#762121]">
          Новости прихода
        </h2>
        <Link href="/news" className="text-[#C5A059] hover:text-[#762121] transition font-medium text-sm uppercase tracking-wider hidden sm:block">
          Все новости →
        </Link>
      </div>

      {/* Контейнер для слайдера + стрелок */}
      <div className="relative group px-4 md:px-0">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="!pb-4"
        >
          {news.map((item) => (
            <SwiperSlide key={item.id} className="h-auto pb-2">
              <Link href={`/news/${item.id}`} className="group/card cursor-pointer flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300">
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {(() => {
                    const coverUrl = (item.image_urls && item.image_urls.length > 0) ? item.image_urls[0] : item.image_url;
                    const photoCount = item.image_urls ? item.image_urls.length : (item.image_url ? 1 : 0);
                    return coverUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverUrl} alt={item.title} className="object-cover w-full h-full transform group-hover/card:scale-105 transition duration-700" />
                        {photoCount > 1 && (
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
                            📷 {photoCount}
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Нет фото</div>
                    );
                  })()}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <time className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-2 block">{item.published_date}</time>
                  <h3 className="text-lg font-serif font-bold text-[#1F1F1F] mb-3 group-hover/card:text-[#762121] transition line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{item.description}</p>
                  <span className="text-[#762121] text-sm font-medium border-b border-transparent group-hover/card:border-[#762121] transition w-max">Читать далее</span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* --- СТРЕЛКИ-КРЕСТИКИ --- */}

        {/* Влево */}
        <button className="custom-prev absolute top-1/2 -left-2 md:-left-12 z-20 w-10 h-10 text-[#762121] hover:text-[#C5A059] transition transform -translate-y-1/2 cursor-pointer bg-white/80 rounded-full md:bg-transparent shadow-md md:shadow-none p-2 md:p-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            {/* Горизонтальная палка стрелки */}
            <path d="M20 12H4" strokeLinecap="round" />
            {/* Наконечник стрелки */}
            <path d="M10 18L4 12L10 6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Вертикальная перекладина (делает крест) */}
            <path d="M12 8V16" strokeLinecap="round" strokeOpacity="0.5" />
          </svg>
        </button>

        {/* Вправо */}
        <button className="custom-next absolute top-1/2 -right-2 md:-right-12 z-20 w-10 h-10 text-[#762121] hover:text-[#C5A059] transition transform -translate-y-1/2 cursor-pointer bg-white/80 rounded-full md:bg-transparent shadow-md md:shadow-none p-2 md:p-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            <path d="M4 12H20" strokeLinecap="round" />
            <path d="M14 6L20 12L14 18" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8V16" strokeLinecap="round" strokeOpacity="0.5" />
          </svg>
        </button>

      </div>
    </section>
  );
}