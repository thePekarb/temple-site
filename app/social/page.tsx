export default function Social() {
    return (
      <main className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-[#762121] mb-10">
          Приходская жизнь и Святыни
        </h1>
  
        {/* Блок про Источник */}
        <section className="mb-16">
          <div className="relative rounded-2xl overflow-hidden bg-[#762121] text-white shadow-xl">
            <div className="p-8 md:p-12 relative z-10">
              <h2 className="text-3xl font-serif font-bold text-[#C5A059] mb-6">
                Святой живоносный источник
              </h2>
              <p className="text-lg leading-relaxed mb-6 text-gray-100">
                Расположен в пойме реки Царицы, ниже красной кирпичной часовни. 
                К источнику ведут деревянные ступени, рядом устроена купель открытого типа.
              </p>
              <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/20">
  {/* ИСПОЛЬЗУЕМ КРАСИВЫЕ ЕЛОЧКИ ВМЕСТО ОБЫЧНЫХ КАВЫЧЕК */}
  <p className="italic">
    «Тропинки к нему не зарастают ни летом, ни зимой. Люди берут святую воду, купаются в купели с молитвой и благодарят Бога за полученные благодеяния.»
  </p>
</div>
            </div>
            {/* Декоративный круг на фоне */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </section>
  
        {/* Блок про Деятельность */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#C5A059]/20">
            <h3 className="text-xl font-serif font-bold text-[#762121] mb-4">Богослужебная жизнь</h3>
            <p className="text-gray-600">
              Центром жизни прихода является регулярное совершение богослужений и Таинств Церкви: Литургии, исповеди, крещения, венчания и отпевания.
            </p>
          </div>
  
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#C5A059]/20">
            <h3 className="text-xl font-serif font-bold text-[#762121] mb-4">Община</h3>
            <p className="text-gray-600">
              Приход стремится к тому, чтобы храм был местом братского общения и поддержки. Здесь находят помощь люди разных возрастов, которым Церковь становится настоящей семьёй.
            </p>
          </div>
        </section>
  
      </main>
    );
  }