import { useEffect, useState } from 'react';

export const FallingSnow = ({ parallaxOffset }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    // Создаём 80 маленьких снежинок с разными параметрами
    const flakes = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Позиция по горизонтали (0-100%)
      delay: Math.random() * 8, // Задержка начала падения (0-8 сек)
      duration: 8 + Math.random() * 12, // Скорость падения (8-20 сек)
      size: 2 + Math.random() * 3, // Размер снежинки (2-5px)
      opacity: 0.4 + Math.random() * 0.4, // Прозрачность (0.4-0.8)
      sway: (Math.random() - 0.5) * 30, // Боковое смещение для обтекания
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      style={{
        transform: `translate3d(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px, 0)`,
      }}
    >
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-20px] snowflake"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `fall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            '--sway': `${flake.sway}px`,
          }}
        >
          <div className="w-full h-full bg-white rounded-full shadow-lg shadow-white/70 blur-[0.5px]" />
        </div>
      ))}
    </div>
  );
};

