import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

export default function Iridescence({
  color = [0.2, 0.0, 0.0],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = false,
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!ctnDom.current || isInitialized.current) return;
    
    const ctn = ctnDom.current;
    
    // Criar canvas manualmente com configurações específicas
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: #0a0000 !important;
      z-index: -10 !important;
      pointer-events: none !important;
      display: block !important;
      transform: translateZ(0) !important;
      -webkit-transform: translateZ(0) !important;
      backface-visibility: hidden !important;
      -webkit-backface-visibility: hidden !important;
      image-rendering: optimizeSpeed !important;
      image-rendering: pixelated !important;
      image-rendering: -webkit-optimize-contrast !important;
    `;
    
    canvasRef.current = canvas;
    ctn.appendChild(canvas);
    
    // Configurar WebGL com máxima estabilidade
    const renderer = new Renderer({
      canvas,
      alpha: false,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false
    });
    
    rendererRef.current = renderer;
    const gl = renderer.gl;
    
    // Forçar background sólido no contexto WebGL
    gl.clearColor(0.04, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    
    let program: Program;
    let isDestroyed = false;

    const resize = () => {
      if (isDestroyed) return;
      
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      
      renderer.setSize(w * dpr, h * dpr);
      gl.viewport(0, 0, w * dpr, h * dpr);
      
      if (program) {
        program.uniforms.uResolution.value = new Color(
          canvas.width,
          canvas.height,
          canvas.width / canvas.height
        );
      }
    };

    // Configurar geometria e shader
    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(canvas.width, canvas.height, canvas.width / canvas.height),
        },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    
    // Primeira renderização imediata
    resize();
    gl.clear(gl.COLOR_BUFFER_BIT);
    renderer.render({ scene: mesh });
    
    // Loop de animação otimizado
    function animate(time: number) {
      if (isDestroyed || !ctn.parentNode) return;
      
      animationRef.current = requestAnimationFrame(animate);
      
      program.uniforms.uTime.value = time * 0.001;
      
      gl.clearColor(0.04, 0, 0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      renderer.render({ scene: mesh });
    }
    
    // Iniciar animação com pequeno delay para estabilidade
    setTimeout(() => {
      if (!isDestroyed) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }, 100);

    // Event listener para resize
    window.addEventListener("resize", resize, { passive: true });
    
    isInitialized.current = true;

    return () => {
      isDestroyed = true;
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      window.removeEventListener("resize", resize);
      
      try {
        // Cleanup WebGL
        if (gl && !gl.isContextLost()) {
          const extension = gl.getExtension("WEBGL_lose_context");
          if (extension) {
            extension.loseContext();
          }
        }
        
        if (canvasRef.current && ctn.contains(canvasRef.current)) {
          ctn.removeChild(canvasRef.current);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      
      rendererRef.current = null;
      canvasRef.current = null;
      isInitialized.current = false;
    };
  }, [color, speed, amplitude]);

  return (
    <div
      ref={ctnDom}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        background: '#0a0000',
        pointerEvents: 'none',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        contain: 'strict',
        isolation: 'isolate',
      }}
    />
  );
}
