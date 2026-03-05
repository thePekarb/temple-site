'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ScheduleItem {
    id: number;
    image_url?: string;
}

interface ScheduleCarouselProps {
    items: ScheduleItem[];
    isAdmin?: boolean;
    onDelete?: (id: number) => void;
}

export default function ScheduleCarousel({ items, isAdmin, onDelete }: ScheduleCarouselProps) {
    const images = items.filter(item => item.image_url);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (images.length === 0) {
        return (
            <div className="bg-white/40 p-12 rounded-3xl border border-[#C5A059]/20 shadow-sm text-center">
                <p className="text-gray-500 font-medium">Расписание пока не загружено.</p>
            </div>
        );
    }

    return (
        <>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-[#C5A059]/20 bg-white group">
                <Swiper
                    modules={[Navigation, Pagination, Keyboard]}
                    navigation
                    pagination={{ clickable: true }}
                    keyboard={{ enabled: true }}
                    loop={images.length > 1}
                    className="w-full aspect-[4/3] md:aspect-[21/9] lg:aspect-[3/1]"
                >
                    {images.map((item) => (
                        <SwiperSlide key={item.id} className="relative w-full h-full bg-gray-100 flex items-center justify-center cursor-pointer" onClick={() => setSelectedImage(item.image_url!)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.image_url}
                                alt="Расписание"
                                className="w-full h-full object-contain md:object-cover max-h-[80vh]"
                            />
                            {isAdmin && onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(item.id);
                                    }}
                                    className="absolute top-4 right-4 p-3 bg-red-100/90 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition shadow-md z-10"
                                    title="Удалить фото"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Полноэкранный просмотр фото */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 md:p-8"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition p-2 bg-black/50 rounded-full backdrop-blur-sm shadow-lg z-50"
                        onClick={() => setSelectedImage(null)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="relative flex flex-col items-center justify-center w-full h-full max-w-[100vw] max-h-[100vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={selectedImage}
                            alt="Расписание полноэкранное"
                            className="max-w-[100vw] max-h-[100vh] md:max-w-[95vw] md:max-h-[95vh] object-contain select-none"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
