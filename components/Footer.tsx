'use client';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="relative bg-[#1E140A] text-gray-300 overflow-hidden">
            {/* Золотая линия сверху */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-12">

                    {/* Колонка 1: О храме */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            {/* Православный крест */}
                            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" className="text-[#C5A059]">
                                <path d="M12 0v36M6 6h16M8 14h12M10 28l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-white leading-tight">
                                    Церковь Иоанна<br />Богослова
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            При святом живоносном источнике<br />
                            в пойме реки Царицы
                        </p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">
                            Волгоградская Епархия
                        </p>
                    </div>

                    {/* Колонка 2: Расписание */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-[#C5A059] mb-6">Расписание храма</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400">Пн — Пт</span>
                                <span className="text-white font-medium">10:00 — 18:00</span>
                            </li>
                            <li className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-gray-400">Суббота</span>
                                <span className="text-white font-medium">10:00 — 20:00</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-gray-400">Воскресенье</span>
                                <span className="text-white font-medium">08:00 — 18:00</span>
                            </li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                            Церковная лавка работает по графику храма
                        </p>
                    </div>

                    {/* Колонка 3: Контакты */}
                    <div>
                        <h4 className="font-serif text-lg font-bold text-[#C5A059] mb-6">Контакты</h4>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Адрес</p>
                                <p className="text-gray-300">ул. Бурейская, 1/1<br />п. Ангарский, Дзержинский р-н<br />Волгоград</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Настоятель храма</p>
                                <p className="text-gray-300">Иеромонах Николай (Дранников)</p>
                                <a href="tel:+79093876432" className="text-[#C5A059] hover:text-[#D4B87A] transition mt-1 inline-block">
                                    +7 909 387-64-32
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Нижняя полоса */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <nav className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest text-gray-500">
                        <Link href="/news" className="hover:text-[#C5A059] transition">Новости</Link>
                        <Link href="/schedule" className="hover:text-[#C5A059] transition">Расписание</Link>
                        <Link href="/history" className="hover:text-[#C5A059] transition">История</Link>
                        <Link href="/gallery" className="hover:text-[#C5A059] transition">Галерея</Link>
                        <Link href="/contacts" className="hover:text-[#C5A059] transition">Контакты</Link>
                    </nav>
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} Храм Иоанна Богослова
                    </p>
                </div>
            </div>

            {/* Декоративный градиент */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
        </footer>
    );
}
