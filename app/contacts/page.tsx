'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/utils/supabase';
import AdminEditBtn from '@/components/AdminEditBtn';
import Modal from '@/components/Modal';
import ImageUpload from '@/components/ImageUpload';

function AnimatedSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >{children}</motion.div>
  );
}

export default function ContactsPage() {
  const [data, setData] = useState({ address: '', phone: '', info: '', priest_phone: '', priest_photo_url: '' });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ address: '', phone: '', info: '', priest_phone: '', priest_photo_url: '' });

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('contacts').select('*').single();
      if (data) setData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleEdit = () => {
    setFormData(data);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('contacts').upsert([{ id: 1, ...formData }]);
    setData(formData);
    setIsModalOpen(false);
  };

  if (loading) return <div className="pt-32 text-center text-gray-500">Загрузка...</div>;

  return (
    <main className="min-h-screen pt-24 px-4 md:px-6 max-w-6xl mx-auto pb-16">
      {/* Шапка */}
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#C5A059] text-sm font-bold tracking-[0.3em] uppercase block mb-4"
        >
          Свяжитесь с нами
        </motion.span>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#762121]">Контакты</h1>
          <AdminEditBtn onClick={handleEdit} />
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Левая колонка — информация */}
        <div className="space-y-6">

          {/* Настоятель */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#C5A059]/20 relative overflow-hidden flex flex-col md:flex-row gap-6 md:items-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C5A059]/10 to-transparent" />

              {/* Фото настоятеля */}
              <div className="w-24 h-24 shrink-0 rounded-full bg-[#762121] flex items-center justify-center overflow-hidden border-2 border-[#C5A059]/30 relative z-10">
                {data.priest_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.priest_photo_url} alt="Настоятель" className="w-full h-full object-cover" />
                ) : (
                  <svg width="24" height="32" viewBox="0 0 24 32" fill="none" className="text-[#C5A059]">
                    <line x1="7" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="12" y1="0" x2="12" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="7" y1="20" x2="17" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>

              <div className="relative z-10">
                <h3 className="font-serif font-bold text-[#762121] text-lg mb-1">⛪ Настоятель храма</h3>
                <p className="text-xl font-serif font-bold text-[#1F1F1F] mt-3">
                  Иеромонах Николай (Дранников)
                </p>
                <p className="text-sm text-gray-500 mt-4 mb-1 font-medium">📞 Телефон для справок:</p>
                <a
                  href={`tel:${data.priest_phone || '+79093876432'}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#762121] text-white rounded-full hover:bg-[#C5A059] transition-all text-sm font-medium"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  {data.priest_phone || '+7 909 387-64-32'}
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Расписание */}
          <AnimatedSection delay={0.2}>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#C5A059]/20">
              <h3 className="font-serif font-bold text-[#762121] text-lg mb-4">🕐 Расписание храма</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Пн — Пт</span>
                  <span className="font-bold text-[#1F1F1F]">10:00 — 18:00</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Суббота</span>
                  <span className="font-bold text-[#1F1F1F]">10:00 — 20:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Воскресенье</span>
                  <span className="font-bold text-[#1F1F1F]">08:00 — 18:00</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  <strong className="text-[#762121]">Церковная лавка</strong> находится в храме.
                  Работает по графику храма. Отдельной лавки нет.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Адрес */}
          <AnimatedSection delay={0.3}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#C5A059]/20">
              <h3 className="font-serif font-bold text-[#762121] text-lg mb-2">📍 Адрес</h3>
              <p className="text-gray-700">{data.address || 'ул. Бурейская, 1/1, п. Ангарский, Дзержинский район, Волгоград'}</p>
            </div>
          </AnimatedSection>

          {/* Телефон из базы */}
          {data.phone && (
            <AnimatedSection delay={0.4}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#C5A059]/20">
                <h3 className="font-serif font-bold text-[#762121] text-lg mb-2">📞 Телефон</h3>
                <p className="text-gray-700">{data.phone}</p>
              </div>
            </AnimatedSection>
          )}

          {/* Доп. инфо */}
          {data.info && (
            <AnimatedSection delay={0.5}>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#C5A059]/20">
                <h3 className="font-serif font-bold text-[#762121] text-lg mb-2">ℹ️ Информация</h3>
                <p className="text-gray-700">{data.info}</p>
              </div>
            </AnimatedSection>
          )}
        </div>

        {/* Правая колонка — карта */}
        <AnimatedSection delay={0.3}>
          <div className="h-[500px] md:h-full min-h-[400px] bg-gray-100 rounded-2xl overflow-hidden border-2 border-[#C5A059]/20 relative shadow-sm">
            <iframe
              src="https://yandex.ru/map-widget/v1/?text=Волгоград+ул+Бурейская+1/1&z=16"
              width="100%" height="100%" frameBorder="0"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </AnimatedSection>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Редактировать контакты">
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="text-lg font-bold text-[#762121] border-b pb-2">Храм</h3>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Адрес</label>
            <input className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#C5A059]" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Телефон</label>
            <input className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#C5A059]" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Доп. информация</label>
            <textarea className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#C5A059]" value={formData.info} onChange={e => setFormData({ ...formData, info: e.target.value })} />
          </div>

          <h3 className="text-lg font-bold text-[#762121] border-b pb-2 pt-4">Настоятель</h3>
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-700">Телефон настоятеля</label>
            <input className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#C5A059]" value={formData.priest_phone} onChange={e => setFormData({ ...formData, priest_phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700">Фотография настоятеля</label>
            <ImageUpload
              value={formData.priest_photo_url}
              onChange={(url) => setFormData({ ...formData, priest_photo_url: url })}
            />
          </div>

          <button className="w-full bg-[#762121] text-white py-3 mt-4 rounded-lg hover:bg-[#C5A059] transition font-medium">Сохранить</button>
        </form>
      </Modal>
    </main>
  );
}