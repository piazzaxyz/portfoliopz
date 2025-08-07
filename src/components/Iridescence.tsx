import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef, useCallback } from "react";

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
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const rendererRef = useRef<Renderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    if (rendererRef.current) {
      const gl = rendererRef.current.gl;
      
      // Limpar WebGL context
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }
      
      rendererRef.current = null;
    }
    
    if (canvasRef.current && canvasRef.current.parentNode) {
      canvasRef.current.parentNode.removeChild(canvasRef.current);
      canvasRef.current = null;
    }
    
    isInitializedRef.current = false;
  }, []);

  useEffect(() => {
    if (!ctnDom.current || isInitializedRef.current) return;

    const ctn = ctnDom.current;
    let isMounted = true;
    
    // Criar canvas manualmente para melhor controle
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    
    // Configurar canvas ANTES de adicionar ao DOM
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #100000;
      pointer-events: none;
      z-index: -1;
      display: block;
      opacity: 1;
    `;
    
    // Adicionar canvas ao DOM
    ctn.appendChild(canvas);
    
    try {
      // Configuração otimizada do renderer
      const renderer = new Renderer({
        canvas: canvas,
        alpha: false, // Mudado para false para evitar transparência
        premultipliedAlpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "default"
      });

      rendererRef.current = renderer;
      const gl = renderer.gl;
      
      // Configuração inicial do WebGL
      gl.clearColor(0.0627, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.STENCIL_TEST);

      let program: Program;
      let mesh: Mesh;

      const resize = () => {
        if (!isMounted || !ctn.parentNode || !canvas) return;
        
        const rect = ctn.getBoundingClientRect();
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        
        const width = Math.max(rect.width * scale, 1);
        const height = Math.max(rect.height * scale, 1);
        
        renderer.setSize(width, height);
        
        if (program) {
          program.uniforms.uResolution.value = new Color(width, height, width / height);
        }
      };

      // Event listeners
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(resize);
      });
      resizeObserver.observe(ctn);
      
      // Resize inicial
      resize();

      const geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new Color(...color) },
          uResolution: {
            value: new Color(
              gl.canvas.width,
              gl.canvas.height,
              gl.canvas.width / gl.canvas.height
            ),
          },
          uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
          uAmplitude: { value: amplitude },
          uSpeed: { value: speed },
        },
      });

      mesh = new Mesh(gl, { geometry, program });

      const update = (t: number) => {
        if (!isMounted || !ctn.parentNode || !canvas) return;
        
        try {
          program.uniforms.uTime.value = t * 0.001;
          
          // Limpar com cor consistente
          gl.clearColor(0.0627, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
          
          renderer.render({ scene: mesh });
          
          if (isMounted) {
            animationRef.current = requestAnimationFrame(update);
          }
        } catch (error) {
          console.warn('WebGL render error:', error);
          if (isMounted) {
            animationRef.current = requestAnimationFrame(update);
          }
        }
      };

      isInitializedRef.current = true;
      
      // Iniciar animação após um pequeno delay para garantir que tudo está pronto
      setTimeout(() => {
        if (isMounted) {
          animationRef.current = requestAnimationFrame(update);
        }
      }, 16);

      return () => {
        isMounted = false;
        resizeObserver.disconnect();
        cleanup();
      };

    } catch (error) {
      console.error('Failed to initialize Iridescence:', error);
      isInitializedRef.current = false;
      // Manter o canvas com background sólido mesmo se WebGL falhar
      if (canvas) {
        canvas.style.background = '#100000';
      }
    }

  }, [color, speed, amplitude, mouseReact, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div
      ref={ctnDom}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        background: '#100000',
        pointerEvents: 'none',
        overflow: 'hidden',
        contain: 'strict',
        isolation: 'isolate',
        willChange: 'auto'
      }}
    />
  );
}
