import { useRef, useEffect } from 'react';
import './Iridescence.css';

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

const Iridescence: React.FC<IridescenceProps> = ({
  color = [0.5, 0.1, 0.1],
  speed = 0.5,
  amplitude = 0.03,
  mouseReact = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !mouseReact) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;
      
      container.style.setProperty('--mouse-x', `${mouseRef.current.x}%`);
      container.style.setProperty('--mouse-y', `${mouseRef.current.y}%`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [mouseReact]);

  return (
    <div 
      ref={containerRef}
      className="iridescence-container"
      style={{
        '--color-r': color[0],
        '--color-g': color[1],
        '--color-b': color[2],
        '--speed': speed,
        '--amplitude': amplitude,
        '--mouse-x': '50%',
        '--mouse-y': '50%'
      } as React.CSSProperties}
    >
      <div className="iridescence-layer layer-1"></div>
      <div className="iridescence-layer layer-2"></div>
      <div className="iridescence-layer layer-3"></div>
      <div className="iridescence-overlay"></div>
    </div>
  );
};

export default Iridescence;
