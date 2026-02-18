'use client';
import { YMaps, Map, Placemark, ZoomControl } from '@pbe/react-yandex-maps';

export default function GuideMap() {
  // Центр карты (среднее арифметическое ваших точек)
  const mapState = { center: [48.708855, 44.487117], zoom: 18 };

  const points = [
    {
      coords: [48.708855, 44.487259],
      title: "Святой Источник",
      desc: "Место для набора воды и купель (внизу)",
      color: "#762121" // Бордовый
    },
    {
      coords: [48.708883, 44.487117],
      title: "Лестница",
      desc: "Рядом с храмом",
      color: "#C5A059" // Золотой
    },
    {
      coords: [48.708627, 44.486966],
      title: "Мостик",
      desc: "возможность входа с балки",
      color: "#1F75FE" // Голубой (вода)
    },
    {
      coords: [48.708947, 44.486597],
      title: "Вход на территорию",
      desc: "Ворота / Проход",
      color: "#1F1F1F" // Черный
    },
    {
      coords: [48.708964, 44.486792],
      title: "Храм(часовня)",
      desc: "Место для молитвы и благодарения",
      color: "#555555" // Серый
    }
  ];

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border-2 border-[#C5A059]/30 relative">
      <YMaps>
        <Map defaultState={mapState} width="100%" height="100%">
          {/* Исправленная кнопка зума (убрали float, оставили позицию по умолчанию или задали position) */}
          <ZoomControl options={{ position: { right: 10, top: 10 } }} />
          
          {points.map((point, index) => (
            <Placemark
              key={index}
              geometry={point.coords}
              properties={{
                balloonContentHeader: point.title,
                balloonContentBody: point.desc,
              }}
              options={{
                preset: 'islands#dotIcon',
                iconColor: point.color,
              }}
              modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
            />
          ))}
        </Map>
      </YMaps>
      
      {/* Легенда карты (наложение сверху) */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-4 rounded-xl shadow-md max-w-[200px] text-sm hidden sm:block">
        <h4 className="font-bold mb-2 text-[#762121]">Обозначения:</h4>
        <ul className="space-y-2">
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#762121]"></span> Источник</li>
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1F75FE]"></span> Мостик</li>
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#C5A059]"></span> Лестница</li>
        </ul>
      </div>
    </div>
  );
}