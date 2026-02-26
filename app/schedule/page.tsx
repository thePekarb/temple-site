'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import AdminEditBtn from '@/components/AdminEditBtn';
import Modal from '@/components/Modal';
import ImageUpload from '@/components/ImageUpload';

// Типы данных
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

// Порядок дней для сортировки
const DAYS_ORDER = [
  'Будние дни',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
  'Праздничные дни'
];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Состояние: админ или нет

  // Состояния редактора
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Форма
  const [formData, setFormData] = useState({
    day_of_week: DAYS_ORDER[0],
    time: '08:00',
    event_title: '',
    is_holiday: false,
    event_date: '',
    image_url: ''
  });

  // Загрузка данных и проверка прав
  useEffect(() => {
    // 1. Проверяем, админ ли это
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdmin(!!session);
    };
    checkUser();

    // 2. Загружаем расписание
    const fetchSchedule = async () => {
      const { data } = await supabase
        .from('schedule')
        .select('*')
        .order('time', { ascending: true }); // Сортируем внутри дня по времени

      if (data) setSchedule(data);
      setLoading(false);
    };

    fetchSchedule();
  }, []);

  // Открытие редактора
  const openEditor = (item?: ScheduleItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        day_of_week: item.day_of_week,
        time: item.time,
        event_title: item.event_title,
        is_holiday: item.is_holiday,
        event_date: item.event_date || '',
        image_url: item.image_url || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        day_of_week: DAYS_ORDER[0],
        time: '08:00',
        event_title: '',
        is_holiday: false,
        event_date: '',
        image_url: ''
      });
    }
    setIsModalOpen(true);
  };

  // Сохранение (Create / Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from('schedule').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('schedule').insert([payload]);
        if (error) throw error;
      }
      // Перезагрузка для обновления данных
      window.location.reload();
    } catch (error: any) {
      alert('Ошибка при сохранении: ' + error.message);
    }
  };

  // Удаление
  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту службу?')) return;

    try {
      const { error } = await supabase.from('schedule').delete().eq('id', id);
      if (error) throw error;
      window.location.reload();
    } catch (error: any) {
      alert('Ошибка удаления: ' + error.message);
    }
  };

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) return <div className="pt-32 text-center text-gray-500">Загрузка расписания...</div>;

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-[#762121] mb-4 inline-flex items-center gap-3">
          Богослужения
          {/* Кнопка добавления видна только админу */}
          {isAdmin && <AdminEditBtn onClick={() => openEditor()} />}
        </h1>
        <p className="text-gray-600">
          Актуальное расписание
        </p>
      </div>

      <div className="space-y-8">
        {/* Проходимся по списку дней в правильном порядке */}
        {DAYS_ORDER.map((dayName) => {
          // Фильтруем записи для этого дня
          const dayServices = schedule.filter(s => s.day_of_week === dayName);

          if (dayServices.length === 0) return null;

          // Находим дату последнего обновления
          const lastUpdated = dayServices.reduce((latest, current) => {
            return (current.updated_at && current.updated_at > latest) ? current.updated_at : latest;
          }, '');

          return (
            <div key={dayName} className="bg-white rounded-2xl shadow-sm border border-[#C5A059]/30 overflow-hidden">
              {/* Заголовок Дня */}
              <div className="bg-[#FCFAF7] px-6 py-4 border-b border-[#C5A059]/20 flex justify-between items-center">
                <h2 className="font-serif font-bold text-xl text-[#762121] uppercase tracking-wider">
                  {dayName}
                </h2>
                {lastUpdated && (
                  <span className="text-xs text-gray-400 font-mono">
                    Обновлено: {new Date(lastUpdated).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              {/* Список служб */}
              <div className="divide-y divide-gray-100">
                {dayServices.map((service) => (
                  <div key={service.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 transition group relative">

                    <div className="flex items-center gap-6">
                      <div className={`text-2xl md:text-3xl font-serif font-bold ${service.is_holiday ? 'text-[#C5A059]' : 'text-[#762121]'}`}>
                        {service.time}
                      </div>
                      <div>
                        {service.event_date && (
                          <div className="text-xs font-bold text-[#C5A059] uppercase tracking-wider mb-1">
                            {formatDate(service.event_date)}
                          </div>
                        )}
                        <div className="font-medium text-lg text-[#1F1F1F] leading-snug">
                          {service.event_title}
                        </div>
                        {service.is_holiday && (
                          <span className="text-xs text-white bg-[#C5A059] px-2 py-0.5 rounded-full mt-1 inline-block">
                            Праздник
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Фото (если есть) */}
                    {service.image_url && (
                      <div className="ml-4 shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-sm border border-gray-100 hidden sm:block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={service.image_url} alt={service.event_title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Кнопки управления (Только для Админа) */}
                    {isAdmin && (
                      <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <AdminEditBtn onClick={() => openEditor(service)} />
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition"
                          title="Удалить"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Модальное окно */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Изменить службу' : 'Добавить службу'}
      >
        <form onSubmit={handleSave} className="space-y-5">

          {/* Выбор дня недели */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">День недели</label>
            <select
              value={formData.day_of_week}
              onChange={e => setFormData({ ...formData, day_of_week: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#C5A059] bg-white"
            >
              {DAYS_ORDER.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          {/* Выбор времени */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Время начала</label>
            <input
              type="time"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#C5A059]"
              required
            />
          </div>

          {/* Название */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название богослужения</label>
            <input
              type="text"
              value={formData.event_title}
              onChange={e => setFormData({ ...formData, event_title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#C5A059]"
              placeholder="Например: Божественная Литургия"
              required
            />
          </div>

          {/* Конкретная Дата (необязательно) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Конкретная дата (необязательно)</label>
            <input
              type="date"
              value={formData.event_date}
              onChange={e => setFormData({ ...formData, event_date: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:border-[#C5A059]"
            />
            <p className="text-xs text-gray-500 mt-1">Оставьте пустым, если это регулярная еженедельная служба</p>
          </div>

          {/* Фото (необязательно) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Фотография для расписания (необязательно)</label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
            />
          </div>

          {/* Чекбокс Праздник */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <input
              type="checkbox"
              id="isHoliday"
              checked={formData.is_holiday}
              onChange={e => setFormData({ ...formData, is_holiday: e.target.checked })}
              className="w-5 h-5 accent-[#762121]"
            />
            <label htmlFor="isHoliday" className="text-sm text-gray-700 cursor-pointer select-none">
              Выделить цветом (Праздничная служба)
            </label>
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
              className="px-6 py-2 bg-[#762121] text-white rounded-lg hover:bg-[#C5A059] transition shadow-md"
            >
              Сохранить
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}