'use client';
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import NewsSection from '@/components/NewsSection';
import GuideMap from '@/components/GuideMap';
import { supabase } from '@/utils/supabase';

/* ═══════════════════════════════════════
   ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
   ═══════════════════════════════════════ */

// Православный крест SVG
function OrthodoxCross({ className = '' }: { className?: string }) {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className={className}>
      <line x1="6" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="0" x2="10" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="21" x2="14" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Орнаментный разделитель с крестом
function OrnamentDivider() {
  return (
    <div className="ornament-divider">
      <OrthodoxCross className="text-[#C5A059] animate-pulse-soft" />
    </div>
  );
}

// Анимированная секция (появляется при скролле)
function AnimatedSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Элемент таймлайна
function TimelineItem({ year, title, text, index }: {
  year: string;
  title: string;
  text: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative mb-12 md:mb-16">
      {/* Точка на таймлайне */}
      <motion.div
        className="timeline-dot"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Карточка */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        className={`
          md:w-[calc(50%-40px)]
          ${isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}
          ml-12 md:ml-0
        `}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm border border-[#C5A059]/20 hover:shadow-lg hover:border-[#C5A059]/40 transition-all duration-500 group relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl md:text-4xl font-serif font-bold text-[#C5A059] group-hover:text-[#762121] transition-colors">
              {year}
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C5A059]/30 to-transparent" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#762121] mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">{text}</p>
        </div>
      </motion.div>
    </div>
  );
}

// Scroll-driven водный ручеёк
function WaterStream() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [scrollDir, setScrollDir] = useState(1); // 1 = right→left, -1 = left→right
  const [scrollAmount, setScrollAmount] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollAmount(latest);
    // Flip direction every ~20% of scroll
    const segment = Math.floor(latest * 5);
    setScrollDir(segment % 2 === 0 ? 1 : -1);
  });

  // Generate drops deterministically
  const drops = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i,
      topPct: 5 + (i * 2.7) % 90,
      size: 4 + (i * 3) % 10,
      baseLeft: 10 + (i * 7.3) % 80,
      delay: (i * 0.4) % 5,
      duration: 3 + (i * 0.7) % 4,
      opacity: 0.15 + (i % 5) * 0.06,
    })), []);

  const splashes = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      topPct: 8 + (i * 5.3) % 84,
      leftPct: 5 + (i * 6.1) % 90,
      dx: ((i % 2 === 0 ? 12 : -12) + (i % 3) * 5),
      dy: -8 - (i % 4) * 4,
      delay: (i * 0.6) % 6,
      size: 2 + (i % 3),
    })), []);

  const ripples = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      topPct: 15 + (i * 11) % 70,
      leftPct: 15 + (i * 12.5) % 70,
      size: 20 + (i * 5) % 30,
      delay: (i * 1.2) % 6,
    })), []);

  // Wave SVG paths that alternate direction
  const streamPaths = useMemo(() => [
    { y: '18%', d: 'M0,20 Q80,5 160,20 T320,20 T480,20 T640,20 T800,20 T960,20 T1120,20', dir: 1 },
    { y: '42%', d: 'M0,15 Q60,30 120,15 T240,15 T360,15 T480,15 T600,15 T720,15 T840,15 T960,15', dir: -1 },
    { y: '65%', d: 'M0,18 Q90,3 180,18 T360,18 T540,18 T720,18 T900,18 T1080,18', dir: 1 },
    { y: '85%', d: 'M0,12 Q70,25 140,12 T280,12 T420,12 T560,12 T700,12 T840,12 T980,12', dir: -1 },
  ], []);

  return (
    <div ref={containerRef} className="water-stream-container">
      {/* SVG gradient definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(120, 190, 230, 0)" />
            <stop offset="30%" stopColor="rgba(120, 190, 230, 0.3)" />
            <stop offset="50%" stopColor="rgba(150, 210, 240, 0.4)" />
            <stop offset="70%" stopColor="rgba(120, 190, 230, 0.3)" />
            <stop offset="100%" stopColor="rgba(120, 190, 230, 0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Stream flow lines */}
      {streamPaths.map((sp, i) => (
        <svg
          key={`stream-${i}`}
          className="water-stream-flow"
          style={{ top: sp.y }}
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
        >
          <path
            d={sp.d}
            style={{
              stroke: 'rgba(140, 200, 235, 0.15)',
              strokeWidth: 2,
              fill: 'none',
              strokeDasharray: '12 8',
              strokeLinecap: 'round',
              animation: `stream-flow ${2 + i * 0.3}s linear infinite${sp.dir * scrollDir < 0 ? ' reverse' : ''}`,
            }}
          />
        </svg>
      ))}

      {/* Water drops that drift with scroll */}
      {drops.map((drop) => {
        const drift = scrollAmount * 80 * scrollDir;
        return (
          <motion.div
            key={`drop-${drop.id}`}
            className="water-drop"
            style={{
              top: `${drop.topPct}%`,
              left: `calc(${drop.baseLeft}% + ${drift}px)`,
              width: drop.size,
              height: drop.size * 1.3,
              opacity: drop.opacity,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            }}
            animate={{
              y: [0, -6, 0, 4, 0],
              x: [0, scrollDir * 3, 0],
              opacity: [drop.opacity, drop.opacity * 1.5, drop.opacity],
            }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Splash particles */}
      {splashes.map((sp) => (
        <div
          key={`splash-${sp.id}`}
          className="water-splash"
          style={{
            top: `${sp.topPct}%`,
            left: `${sp.leftPct}%`,
            width: sp.size,
            height: sp.size,
            animationDelay: `${sp.delay}s`,
            '--splash-dx': `${sp.dx * scrollDir}px`,
            '--splash-dy': `${sp.dy}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Ripple rings */}
      {ripples.map((rp) => (
        <div
          key={`ripple-${rp.id}`}
          className="water-ripple"
          style={{
            top: `${rp.topPct}%`,
            left: `${rp.leftPct}%`,
            width: rp.size,
            height: rp.size,
            animationDelay: `${rp.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   ДАННЫЕ
   ═══════════════════════════════════════ */

const timelineData = [
  {
    year: '1909',
    title: 'Чудесное обретение',
    text: 'Девочка по имени Шура, стирая бельё в пойме реки Царицы, нашла плоский чёрный камень с ликом Иоанна Богослова. Когда камень отодвинули — из-под земли забил прозрачный ключ.',
  },
  {
    year: '1930-е',
    title: 'Годы гонений',
    text: 'Советские власти пытались засыпать источник землёй и закатать в бетон, но родники упрямо пробивались наружу. Память о святом месте хранилась в народном предании.',
  },
  {
    year: '1942',
    title: 'Сталинградская битва',
    text: 'Во время Великой Отечественной войны к источнику приходили за водой и местные жители, и немецкие солдаты. Это стало первым местом примирения в Сталинграде. Раненые воины, омываясь в его водах, быстро исцелялись.',
  },
  {
    year: '1994',
    title: 'Новое обретение',
    text: 'После десятилетий забвения источник вновь обретён и торжественно освящён священниками Казанского кафедрального собора Волгограда.',
  },
  {
    year: '2001',
    title: 'Часовня и купель',
    text: 'Над источником возведена кирпичная часовня. Устроена открытая купель, к которой потянулись тысячи верующих. Вода источника не замерзает даже зимой.',
  },
  {
    year: '2002',
    title: 'Строительство храма',
    text: 'Рядом с источником воздвигнут храм в честь святого апостола и евангелиста Иоанна Богослова, ставший центром духовной жизни прихода.',
  },
  {
    year: '2009',
    title: 'Колокольня и юбилей',
    text: 'Возведена колокольня. 15 октября 2009 года торжественно отмечено 100-летие живоносного источника.',
  },
  {
    year: 'Сегодня',
    title: 'Живой приход',
    text: 'Храм является действующим приходом, объединяющим людей вокруг молитвы, Евхаристии и дел милосердия. Тысячи верующих ежегодно посещают святой источник.',
  },
];

const scheduleData = [
  { days: 'Понедельник — Пятница', time: '10:00 — 18:00', icon: '🕐' },
  { days: 'Суббота', time: '10:00 — 20:00', icon: '🕑' },
  { days: 'Воскресенье', time: '08:00 — 18:00', icon: '🕊️' },
];

/* ═══════════════════════════════════════
   ГЛАВНАЯ СТРАНИЦА
   ═══════════════════════════════════════ */

export default function Home() {
  const [contacts, setContacts] = useState<any>(null);

  useEffect(() => {
    async function fetchContacts() {
      const { data } = await supabase.from('contacts').select('*').single();
      if (data) setContacts(data);
    }
    fetchContacts();
  }, []);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Частицы для hero
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 2 + Math.random() * 3,
    })), []);

  return (
    <main className="flex flex-col min-h-screen">

      {/* ═══════════ 1. HERO ═══════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden hero-parallax">
        {/* Parallax фон */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-bg.webp"
            alt="Храм Иоанна Богослова"
            className="w-full h-[120%] object-cover"
          />
        </motion.div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#1E140A]/70 via-[#1E140A]/50 to-[#1E140A]/80" />

        {/* Частицы (мерцающие точки) */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          {particles.map((p) => (
            <span
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                bottom: '-10px',
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
            />
          ))}
        </div>

        {/* Контент */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          {/* Анимированный крест */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mb-8"
          >
            <svg width="48" height="64" viewBox="0 0 24 32" fill="none" className="mx-auto text-[#C5A059] animate-glow">
              <line x1="7" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12" y1="0" x2="12" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7" y1="24" x2="17" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[#C5A059] text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-6 block"
          >
            Волгоградская Епархия
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-[1.1]"
          >
            Церковь<br />Иоанна Богослова
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-lg md:text-xl font-serif italic text-gray-300 mb-10"
          >
            При Святом живоносном источнике в пойме реки Царицы
          </motion.p>

          {/* CTA кнопки */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/schedule"
              className="px-8 py-3 bg-[#C5A059] text-white font-medium rounded-full hover:bg-[#D4B87A] transition-all duration-300 shadow-lg shadow-[#C5A059]/20 hover:shadow-xl hover:shadow-[#C5A059]/30 hover:-translate-y-0.5"
            >
              Расписание богослужений
            </Link>
            <Link
              href="/history"
              className="px-8 py-3 border-2 border-white/30 text-white font-medium rounded-full hover:bg-white/10 hover:border-white/60 transition-all duration-300 hover:-translate-y-0.5"
            >
              История храма
            </Link>
          </motion.div>
        </motion.div>

        {/* Стрелка вниз */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[#C5A059]/60"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════ 2. ИСТОРИЧЕСКАЯ ЛЕНТА С ВОДНЫМ РУЧЕЙКОМ ═══════════ */}
      <section className="section-church py-20 md:py-28 px-4 bg-[#FCFAF7] relative overflow-hidden">
        {/* Водный ручеёк на фоне */}
        <WaterStream />

        <div className="max-w-5xl mx-auto relative z-[1]">
          <AnimatedSection className="text-center mb-16">
            <span className="text-[#C5A059] text-sm font-bold tracking-[0.3em] uppercase block mb-4">
              Путь сквозь столетия
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#762121] mb-4">
              История святого места
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              От чудесного обретения источника в 1909 году до наших дней — более века веры, испытаний и возрождения
            </p>
          </AnimatedSection>

          {/* Таймлайн */}
          <div className="relative">
            <div className="timeline-line" />
            {timelineData.map((item, i) => (
              <TimelineItem key={i} {...item} index={i} />
            ))}
          </div>

          {/* Кнопка «Подробнее» */}
          <AnimatedSection className="text-center mt-8">
            <Link
              href="/history"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#762121] text-[#762121] font-medium rounded-full hover:bg-[#762121] hover:text-white transition-all duration-300"
            >
              Читать полную историю
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <OrnamentDivider />

      {/* ═══════════ 3. СВЯТОЙ ИСТОЧНИК ═══════════ */}
      <section className="section-church py-20 md:py-28 px-4 bg-[#1E140A] text-white relative overflow-hidden">
        {/* Декоративные кольца */}
        <div className="absolute top-20 -right-32 w-96 h-96 rounded-full border border-[#C5A059]/10 pointer-events-none" />
        <div className="absolute bottom-20 -left-32 w-72 h-72 rounded-full border border-[#C5A059]/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-12">
            <span className="text-[#C5A059] text-sm font-bold tracking-[0.3em] uppercase block mb-4">
              Святыня прихода
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              Живоносный источник
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Апостола и евангелиста Иоанна Богослова
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Левая — текст */}
            <AnimatedSection delay={0.2}>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Святой источник расположен в живописной пойме реки Царицы, в посёлке Ангарском
                Дзержинского района Волгограда. К источнику ведёт спуск с деревянными ступенями,
                рядом устроена купель открытого типа.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Вода источника обладает чудесными свойствами и не замерзает даже
                в самые суровые зимы. Тысячи верующих приезжают сюда, чтобы набрать
                святой воды и окунуться в купели с молитвой.
              </p>

              {/* Цитата */}
              <div className="glass-card p-6 relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="absolute top-4 left-4 text-[#C5A059]/30">
                  <path d="M10 11H6C6 7 8 4 12 3L11 5C9 6 8 8 8 11H10V17H4V11H10ZM22 11H18C18 7 20 4 24 3L23 5C21 6 20 8 20 11H22V17H16V11H22Z" fill="currentColor" />
                </svg>
                <p className="italic text-gray-300 pl-8 text-sm md:text-base leading-relaxed">
                  «Тропинки к нему не зарастают ни летом, ни зимой. Люди берут святую воду,
                  купаются в купели с молитвой и благодарят Бога за полученные благодеяния.»
                </p>
              </div>
            </AnimatedSection>

            {/* Правая — факты */}
            <AnimatedSection delay={0.4}>
              <div className="space-y-4">
                {[
                  { label: 'Обнаружен', value: '1909 год', desc: 'Девочка Шура нашла камень с ликом святого' },
                  { label: 'Освящён повторно', value: '1994 год', desc: 'Священниками Казанского собора' },
                  { label: 'Часовня', value: '2001 год', desc: 'Кирпичная часовня и открытая купель' },
                  { label: 'Особенность', value: 'Не замерзает', desc: 'Вода источника зимой не покрывается льдом' },
                ].map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i + 0.5 }}
                    className="glass-card p-5 hover:border-[#C5A059]/40 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-12 bg-gradient-to-b from-[#C5A059] to-transparent rounded-full shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-[#C5A059] uppercase tracking-widest mb-1">{fact.label}</p>
                        <p className="text-white font-serif font-bold text-lg">{fact.value}</p>
                        <p className="text-gray-500 text-sm mt-1">{fact.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <OrnamentDivider />

      {/* ═══════════ 4. РАСПИСАНИЕ ХРАМА ═══════════ */}
      <section className="section-church py-20 md:py-28 px-4 bg-[#F5EFE0]">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <span className="text-[#C5A059] text-sm font-bold tracking-[0.3em] uppercase block mb-4">
              Часы работы
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#762121] mb-4">
              Расписание храма
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {scheduleData.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="schedule-card text-center">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="font-serif font-bold text-[#762121] text-lg mb-2">{item.days}</h3>
                  <p className="text-2xl md:text-3xl font-serif font-bold text-[#C5A059]">{item.time}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Церковная лавка */}
          <AnimatedSection delay={0.5}>
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#C5A059]/20 text-center max-w-2xl mx-auto shadow-sm">
              <div className="flex items-center justify-center gap-3 mb-3">
                <OrthodoxCross className="text-[#C5A059]" />
                <h3 className="font-serif font-bold text-[#762121] text-xl">Церковная лавка</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Церковная лавка находится в храме, поэтому график работы лавки
                совпадает с расписанием храма. Отдельной от храма церковной лавки нет.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <OrnamentDivider />

      {/* ═══════════ 5. НАСТОЯТЕЛЬ ═══════════ */}
      <section className="section-church py-20 md:py-28 px-4 bg-[#FCFAF7]">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#C5A059]/20 relative overflow-hidden">
              {/* Декоративный угол */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#C5A059]/10 to-transparent" />

              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                {/* Фото настоятеля */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#762121] to-[#5A1818] flex items-center justify-center shrink-0 shadow-lg border-4 border-white overflow-hidden">
                  {contacts?.priest_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={contacts.priest_photo_url} alt="Настоятель" className="w-full h-full object-cover" />
                  ) : (
                    <svg width="48" height="64" viewBox="0 0 24 32" fill="none" className="text-[#C5A059]">
                      <line x1="7" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="12" y1="0" x2="12" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="7" y1="24" x2="17" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                <div className="text-center md:text-left">
                  <p className="text-[#C5A059] text-sm font-bold tracking-[0.2em] uppercase mb-2">
                    Настоятель храма
                  </p>
                  <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#762121] mb-3">
                    Иеромонах Николай
                  </h2>
                  <p className="text-gray-600 font-serif text-lg mb-1">
                    (Дранников)
                  </p>
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-2 font-medium">📞 Телефон для справок:</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <a
                        href={`tel:${contacts?.priest_phone || '+79093876432'}`}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-[#762121] text-white rounded-full hover:bg-[#C5A059] transition-all duration-300 shadow-md hover:-translate-y-0.5"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        {contacts?.priest_phone || '+7 909 387-64-32'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <OrnamentDivider />

      {/* ═══════════ 6. НОВОСТИ ═══════════ */}
      <div className="bg-white border-t border-b border-gray-100">
        <NewsSection />
      </div>

      <OrnamentDivider />

      {/* ═══════════ 7. КАРТА-ПУТЕВОДИТЕЛЬ ═══════════ */}
      <section className="py-16 md:py-20 px-6 max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-10">
          <span className="text-[#C5A059] text-sm font-bold tracking-[0.3em] uppercase block mb-4">
            Как добраться
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#762121] mb-4">
            Паломнику на заметку
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Интерактивная карта территории. Нажмите на точки, чтобы узнать подробности
            о храме и спуске к святому источнику.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <GuideMap />
        </AnimatedSection>
      </section>

    </main>
  );
}