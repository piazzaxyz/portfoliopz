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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader with iridescent effect
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_color;
      uniform float u_speed;
      uniform float u_amplitude;
      uniform bool u_mouseReact;

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouse = u_mouse / u_resolution.xy;
        
        // Base wave pattern
        float wave1 = sin(st.x * 10.0 + u_time * u_speed) * u_amplitude;
        float wave2 = cos(st.y * 8.0 + u_time * u_speed * 0.7) * u_amplitude;
        float wave3 = sin((st.x + st.y) * 12.0 + u_time * u_speed * 1.3) * u_amplitude;
        
        // Mouse interaction
        float mouseEffect = 0.0;
        if (u_mouseReact) {
          float dist = distance(st, mouse);
          mouseEffect = exp(-dist * 3.0) * 0.5;
        }
        
        // Combine waves
        float combined = wave1 + wave2 + wave3 + mouseEffect;
        
        // Create iridescent color shift
        float hue = mod(combined + st.x * 0.3 + st.y * 0.2 + u_time * 0.1, 1.0);
        float saturation = 0.6 + combined * 0.4;
        float brightness = 0.3 + combined * 0.7;
        
        vec3 iridescent = hsv2rgb(vec3(hue, saturation, brightness));
        
        // Mix with base color
        vec3 finalColor = mix(u_color, iridescent, 0.7);
        finalColor *= 0.8 + combined * 0.5; // Add some variation in brightness
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create shaders
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    // Set up geometry
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const colorLocation = gl.getUniformLocation(program, 'u_color');
    const speedLocation = gl.getUniformLocation(program, 'u_speed');
    const amplitudeLocation = gl.getUniformLocation(program, 'u_amplitude');
    const mouseReactLocation = gl.getUniformLocation(program, 'u_mouseReact');

    // Resize canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * window.devicePixelRatio;
      mouseRef.current.y = (rect.height - (e.clientY - rect.top)) * window.devicePixelRatio;
    };

    if (mouseReact) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    // Render loop
    const render = (time: number) => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      // Set up position attribute
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Set uniforms
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.uniform3f(colorLocation, color[0], color[1], color[2]);
      gl.uniform1f(speedLocation, speed);
      gl.uniform1f(amplitudeLocation, amplitude);
      gl.uniform1i(mouseReactLocation, mouseReact ? 1 : 0);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      if (mouseReact) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [color, speed, amplitude, mouseReact]);

  return <canvas ref={canvasRef} className="iridescence-canvas" />;
};

export default Iridescence;
