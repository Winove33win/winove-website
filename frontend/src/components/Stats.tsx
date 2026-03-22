import { useEffect, useRef, useState } from "react";

const useCountUp = (target: number, duration = 2000, started = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;

    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [started, target, duration]);

  return count;
};

type StatItemProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
};

const StatItem = ({ value, suffix = "", prefix = "", label, duration = 2000 }: StatItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, duration, started);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center group">
      <p className="text-4xl md:text-5xl font-extrabold text-primary mb-2 tabular-nums transition-transform duration-300 group-hover:scale-110">
        {prefix}{count}{suffix}
      </p>
      <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
        {label}
      </p>
    </div>
  );
};

export const Stats = () => (
  <section className="py-16 bg-gradient-navy relative overflow-hidden">
    {/* Dot pattern */}
    <div
      className="absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          "radial-gradient(hsl(25 95% 53%) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
    {/* Top / bottom dividers */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        <StatItem value={100} suffix="+" label="Projetos entregues" />
        <StatItem value={5}   suffix="+" label="Anos de experiência" duration={1500} />
        <StatItem value={98}  suffix="%" label="Clientes satisfeitos" />
        <StatItem value={180} suffix="%" label="Crescimento médio de leads" />
      </div>
    </div>
  </section>
);
