'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import AdminEditBtn from '@/components/AdminEditBtn';
import Modal from '@/components/Modal';
import ImageUpload from '@/components/ImageUpload';


interface GalleryItem {
  id: string | number;
  image_url: string;
  source: 'gallery' | 'news';
  caption?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  

  // Загрузка фото
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session); // Если сессия есть - true, иначе - false
    };
    checkUser();
    const fetchImages = async () => {
      // 1. Из таблицы gallery
      const { data: galleryData } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Из таблицы news
      const { data: newsData } = await supabase
        .from('news')
        .select('id, title, image_url, created_at')
        .not('image_url', 'is', null)
        .neq('image_url', '')
        .order('created_at', { ascending: false });

      const manualPhotos: GalleryItem[] = (galleryData || []).map((item) => ({
        id: item.id,
        image_url: item.image_url,
        caption: item.caption,
        source: 'gallery',
      }));

      const newsPhotos: GalleryItem[] = (newsData || []).map((item) => ({
        id: `news-${item.id}`,
        image_url: item.image_url,
        caption: item.title, // Взяли заголовок новости как подпись
        source: 'news',
      }));

      setImages([...manualPhotos, ...newsPhotos]);
      setLoading(false);
    };

    fetchImages();
  }, []);

  // Добавление фото
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) {
      alert('Загрузите фото!');
      return;
    }

    try {
      const { error } = await supabase
        .from('gallery')
        .insert([{ image_url: newImageUrl, caption: newCaption }]);
      
      if (error) throw error;
      
      window.location.reload();
    } catch (err) {
      alert('Ошибка при сохранении');
    }
  };

  // Удаление фото
  const handleDelete = async (id: number) => {
    if (!confirm('Удалить фото?')) return;
    
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      window.location.reload();
    } catch (err) {
      alert('Не удалось удалить');
    }
  };

  if (loading) return <div className="pt-32 text-center">Загрузка...</div>;

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-[#762121] mb-4 inline-flex items-center gap-3">
          Фотолетопись
          <AdminEditBtn onClick={() => setIsModalOpen(true)} />
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="aspect-square relative overflow-hidden rounded-xl group bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.image_url} alt="Фото" className="object-cover w-full h-full hover:scale-110 transition duration-700" />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
               <p className="text-white text-sm font-medium">{img.caption}</p>
               {img.source === 'news' && <span className="text-xs text-[#C5A059]">Из новостей</span>}
               
               {/* Кнопка удаления (только для ручных фото) */}
               {isAdmin && img.source === 'gallery' &&(
                 <button 
                    // Здесь мы преобразуем ID в число, чтобы TypeScript был доволен
                    onClick={() => handleDelete(Number(img.id))}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                 >✕</button>
               )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Добавить фото">
         <form onSubmit={handleAddPhoto} className="space-y-4">
            <div>
               <label className="block mb-2 text-sm font-medium">Фотография</label>
               <ImageUpload value={newImageUrl} onChange={setNewImageUrl} />
            </div>
            <div>
               <label className="block mb-2 text-sm font-medium">Подпись</label>
               <input type="text" className="w-full p-2 border rounded" value={newCaption} onChange={e => setNewCaption(e.target.value)} />
            </div>
            <button className="w-full bg-[#762121] text-white py-2 rounded">Добавить</button>
         </form>
      </Modal>
    </main>
  );
}