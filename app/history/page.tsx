'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

function AnimatedSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const historyBlocks = [
  {
    year: '1909',
    title: 'Чудесное обретение источника',
    text: 'В пойме реки Царицы, в том месте, которое ныне относится к посёлку Ангарскому Дзержинского района Волгограда, произошло удивительное событие. Десятилетняя девочка по имени Шура, стирая бельё у реки, обнаружила плоский чёрный камень с проступившим ликом святого Апостола и Евангелиста Иоанна Богослова. Когда камень отодвинули, из-под земли забил прозрачный ключ — так был обретён Святой живоносный источник.',
    accent: true,
  },
  {
    year: '1910‑е — 1920‑е',
    title: 'Народное почитание',
    text: 'Слухи о чудесном источнике быстро разнеслись по окрестностям. Жители окрестных сёл и Царицына приходили к источнику за водой, веря в её целительные свойства. Место стало местом паломничества и молитвы.',
    accent: false,
  },
  {
    year: '1930‑е',
    title: 'Годы гонений',
    text: 'В период атеистической борьбы советские власти неоднократно пытались уничтожить источник: его засыпали землёй, заливали бетоном. Однако родники упрямо пробивались наружу, словно подтверждая свою чудесную природу. Память о святом месте бережно хранилась в народном предании, передаваясь из поколения в поколение.',
    accent: false,
  },
  {
    year: '1942 — 1943',
    title: 'Сталинградская битва',
    text: 'Во время Великой Отечественной войны к источнику приходили за водой и местные жители, и немецкие солдаты. Это место стало первым местом примирения в разрушенном Сталинграде. По свидетельствам очевидцев, раненые советские воины, омываясь в водах источника, быстро восстанавливали силы и исцелялись от ран.',
    accent: true,
  },
  {
    year: '1950‑е — 1980‑е',
    title: 'Забвение',
    text: 'Долгие десятилетия источник пребывал в забвении. Территория заросла, тропинки стёрлись. Но вода по-прежнему била из-под земли, не замерзая даже в самые суровые зимы. Те немногие, кто помнил о святом месте, тайком приходили сюда набрать воды.',
    accent: false,
  },
  {
    year: '1994',
    title: 'Второе обретение',
    text: 'Наступило время возрождения. Святой источник был вновь обретён и торжественно освящён священниками Казанского кафедрального собора Волгограда. К источнику потянулись паломники со всей Волгоградской области и за её пределами.',
    accent: true,
  },
  {
    year: '2001',
    title: 'Часовня и купель',
    text: 'Осенью 2001 года над источником возведена кирпичная часовня. Устроена открытая купель, где верующие могут совершить омовение с молитвой. Тысячи людей устремились к живоносному источнику.',
    accent: false,
  },
  {
    year: '2002 — 2003',
    title: 'Строительство храма',
    text: 'Рядом с источником построен храм в честь святого Апостола и Евангелиста Иоанна Богослова. Храм стал центром духовной жизни прихода, местом совершения Литургии и Таинств Церкви.',
    accent: true,
  },
  {
    year: '2009',
    title: 'Колокольня и столетний юбилей',
    text: 'Возведена колокольня, голос которой разносится по всей пойме реки Царицы. 15 октября 2009 года торжественно празднуется 100-летие обретения живоносного источника Иоанна Богослова.',
    accent: false,
  },
  {
    year: '2024',
    title: 'Благоустройство территории',
    text: 'Территория вокруг святого источника благоустроена: обновлены спуски, лестницы, подходы к купели. Приход продолжает развиваться, объединяя верующих вокруг Евхаристии, молитвы и дел милосердия.',
    accent: false,
  },
];

export default function History() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 md:px-6">

      {/* Шапка */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[#C5A059] text-sm font-bold tracking-[0.3em] uppercase block mb-4"
        >
          Более века веры
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-serif font-bold text-[#762121] mb-6"
        >
          История храма и источника
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 max-w-2xl mx-auto text-lg"
        >
          От чудесного обретения в 1909 году до наших дней — путь святого места
          через испытания XX века к возрождению и новой жизни.
        </motion.p>
      </div>

      {/* Таймлайн */}
      <div className="max-w-4xl mx-auto relative">
        {/* Вертикальная линия */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#C5A059] to-transparent -translate-x-1/2" />

        {historyBlocks.map((block, i) => {
          const isLeft = i % 2 === 0;
          return (
            <AnimatedSection key={i} delay={0.1 * i} className="relative mb-12 md:mb-16">
              {/* Точка */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full bg-[#C5A059] border-[3px] border-[#FCFAF7] shadow-[0_0_0_3px_#C5A059] z-10" />

              {/* Карточка */}
              <div className={`
                ml-14 md:ml-0
                md:w-[calc(50%-32px)]
                ${isLeft ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4'}
              `}>
                <div className={`
                  rounded-2xl p-6 md:p-8 transition-all duration-500 hover:shadow-lg
                  ${block.accent
                    ? 'bg-white shadow-sm border-l-4 border-[#C5A059]'
                    : 'bg-[#F5EFE0] border border-[#C5A059]/15'
                  }
                `}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl md:text-3xl font-serif font-bold text-[#C5A059]">
                      {block.year}
                    </span>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C5A059]/30 to-transparent" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#762121] mb-3">
                    {block.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {block.text}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Заключение */}
      <AnimatedSection className="max-w-3xl mx-auto mt-16 text-center">
        <div className="bg-[#762121] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <svg width="32" height="42" viewBox="0 0 24 32" fill="none" className="mx-auto mb-6 text-[#C5A059]">
              <line x1="7" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12" y1="0" x2="12" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="7" y1="20" x2="17" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-lg md:text-xl font-serif italic text-gray-200 leading-relaxed">
              «Сегодня храм при святом источнике является действующим приходом,
              объединяющим людей вокруг Евхаристии, молитвы и дел милосердия.
              Тропинки к нему не зарастают ни летом, ни зимой.»
            </p>
          </div>
        </div>
      </AnimatedSection>

    </main>
  );
}