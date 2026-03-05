'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import AdminEditBtn from '@/components/AdminEditBtn';
import Modal from '@/components/Modal';
import ImageUpload from '@/components/ImageUpload';
import ScheduleCarousel from '@/components/ScheduleCarousel';

interface ScheduleItem {
  id: number;
  day_of_week: string;
  time: string;
  event_title: string;
  is_holiday: boolean;
  event_date?: string;
  image_url?: string;
  updated_at?: string;
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    image_url: ''
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };
    checkUser();

    const fetchSchedule = async () => {
      const { data } = await supabase
        .from('schedule')
        .select('*')
        .order('id', { ascending: false }); // Show newest first

      if (data) setSchedule(data);
      setLoading(false);
    };

    fetchSchedule();
  }, []);

  const openEditor = () => {
    setFormData({ image_url: '' });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert("Пожалуйста, загрузите фотографию расписания.");
      return;
    }

    const payload = {
      image_url: formData.image_url,
      // Dummy values required by the DB schema
      day_of_week: 'Будние дни',
      time: '00:00',
      event_title: 'Расписание',
      is_holiday: false,
      updated_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('schedule').insert([payload]);
      if (error) throw error;
      window.location.reload();
    } catch (error: any) {
      alert('Ошибка при сохранении: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту фотографию расписания?')) return;

    try {
      const { error } = await supabase.from('schedule').delete().eq('id', id);
      if (error) throw error;
      window.location.reload();
    } catch (error: any) {
      alert('Ошибка удаления: ' + error.message);
    }
  };

  if (loading) return <div className="pt-32 text-center text-gray-500">Загрузка расписания...</div>;

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-[#762121] mb-4 inline-flex items-center gap-3">
          Расписание богослужений
          {isAdmin && <AdminEditBtn onClick={() => openEditor()} />}
        </h1>
        <p className="text-gray-600">
          Актуальное расписание в нашем храме
        </p>
      </div>

      <div className="w-full">
        <ScheduleCarousel items={schedule} isAdmin={isAdmin} onDelete={handleDelete} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Добавить фото расписания"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Фотография расписания (обязательно)</label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ image_url: url })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!formData.image_url}
              className={`px-6 py-2 text-white rounded-lg transition shadow-md ${formData.image_url ? 'bg-[#762121] hover:bg-[#C5A059]' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Сохранить
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}