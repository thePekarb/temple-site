'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminEditBtn from '@/components/AdminEditBtn';
import Modal from '@/components/Modal';
import MultiImageUpload from '@/components/MultiImageUpload';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  image_url: string;
  image_urls?: string[];
  published_date: string;
}

const PER_PAGE = 6;

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  // Состояния для редактора
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  // Данные формы
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    image_urls: [] as string[],
    published_date: '',
  });

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  // Загрузка новостей с пагинацией
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsAdmin(!!session));
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      // Получаем общее количество
      const { count } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true });
      setTotalCount(count || 0);

      // Получаем новости для текущей страницы
      const from = (currentPage - 1) * PER_PAGE;
      const to = from + PER_PAGE - 1;

      const { data } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false })
        .range(from, to);

      setNews(data || []);
      setLoading(false);
    };

    fetchNews();
  }, [currentPage]);

  // Функция открытия редактора
  const openEditor = (item?: NewsItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description || '',
        content: item.content || '',
        image_url: item.image_url || '',
        image_urls: item.image_urls || (item.image_url ? [item.image_url] : []),
        published_date: item.published_date,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        image_url: '',
        image_urls: [],
        published_date: new Date().toLocaleDateString('ru-RU'),
      });
    }
    setIsModalOpen(true);
  };

  // Сохранение
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      image_url: formData.image_urls.length > 0 ? formData.image_urls[0] : formData.image_url,
    };

    let error;
    if (editingItem) {
      const res = await supabase.from('news').update(payload).eq('id', editingItem.id);
      error = res.error;
    } else {
      const res = await supabase.from('news').insert([payload]);
      error = res.error;
    }

    if (error) {
      alert('Ошибка: ' + error.message);
    } else {
      setIsModalOpen(false);
      setCurrentPage(1);
      window.location.reload();
    }
  };

  // Удаление
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (!error) window.location.reload();
  };

  if (loading) return <div className="text-center pt-32 text-gray-500">Загрузка...</div>;

  return (
    <main className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto">
      <div className="flex items-center mb-8 border-b border-[#C5A059] pb-4">
        <h1 className="text-4xl font-serif font-bold text-[#762121]">Новости прихода</h1>
        <div className="ml-4">
          <AdminEditBtn onClick={() => openEditor()} />
        </div>
        {totalCount > 0 && (
          <span className="ml-auto text-sm text-gray-400">
            Всего: {totalCount}
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {news.map((item) => (
          <div key={item.id} className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative group">

            {isAdmin && (
              <div className="absolute top-2 right-2 z-10 flex gap-2">
                <AdminEditBtn onClick={() => openEditor(item)} />
                <button
                  onClick={() => handleDelete(item.id)}
                  className="hidden group-hover:block px-2 py-1 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700 transition"
                >✕</button>
              </div>
            )}

            <Link href={`/news/${item.id}`} className="block h-full flex flex-col">
              <div className="relative h-56 bg-gray-100 shrink-0">
                {(() => {
                  const coverUrl = (item.image_urls && item.image_urls.length > 0) ? item.image_urls[0] : item.image_url;
                  const photoCount = item.image_urls ? item.image_urls.length : (item.image_url ? 1 : 0);
                  return coverUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverUrl} alt={item.title} className="object-cover w-full h-full" />
                      {photoCount > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          📷 {photoCount}
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Нет фото</div>
                  );
                })()}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <time className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-2 block">{item.published_date}</time>
                <h3 className="text-xl font-serif font-bold text-[#1F1F1F] mb-3 group-hover:text-[#762121] transition">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{item.description}</p>
                <div className="mt-auto">
                  <span className="text-[#762121] text-sm font-medium border-b border-[#762121]/20">Подробнее</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ПАГИНАЦИЯ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {/* Кнопка «Назад» */}
          <button
            onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-[#C5A059]/30 text-[#762121] font-medium text-sm hover:bg-[#762121] hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#762121]"
          >
            ← Назад
          </button>

          {/* Номера страниц */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-10 h-10 rounded-lg font-serif font-bold text-sm transition-all duration-300 ${page === currentPage
                ? 'bg-[#762121] text-white shadow-md shadow-[#762121]/20'
                : 'border border-[#C5A059]/30 text-[#762121] hover:bg-[#C5A059]/10'
                }`}
            >
              {page}
            </button>
          ))}

          {/* Кнопка «Вперёд» */}
          <button
            onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-[#C5A059]/30 text-[#762121] font-medium text-sm hover:bg-[#762121] hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#762121]"
          >
            Вперёд →
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Редактировать новость' : 'Новая новость'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Заголовок</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded-lg focus:border-[#C5A059] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Дата</label>
            <input
              type="text"
              value={formData.published_date}
              onChange={e => setFormData({ ...formData, published_date: e.target.value })}
              className="w-full p-2 border rounded-lg focus:border-[#C5A059] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Фотографии (до 5)</label>
            <MultiImageUpload
              values={formData.image_urls}
              onChange={(urls) => setFormData({ ...formData, image_urls: urls })}
              max={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Краткое описание</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg focus:border-[#C5A059] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Полный текст новости</label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-2 border rounded-lg focus:border-[#C5A059] outline-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Отмена</button>
            <button type="submit" className="px-6 py-2 bg-[#762121] text-white rounded-lg hover:bg-[#C5A059]">Сохранить</button>
          </div>
        </form>
      </Modal>
    </main>
  );
}