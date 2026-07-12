import { useEffect, useRef } from "react";

/**
 * Animated DORITO TRIANGLE canvas widget.
 * Draws a rotating 3D wireframe triangle with TriStar routing visualization.
 * Inspired by the TriStarWidget from adp-mesh.
 */
export default function DoritoTriangle({ size = 320 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const startTime = Date.now();

    // Triangle vertices (equilateral)
    const baseVertices = [
      { x: 0, y: -size * 0.38, z: 0, label: "TARWELL" },
      { x: -size * 0.33, y: size * 0.22, z: 0, label: "TORITO" },
      { x: size * 0.33, y: size * 0.22, z: 0, label: "VAULT" },
    ];

    function project(x: number, y: number, z: number, rotY: number, rotX: number) {
      // Rotate Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;
      // Rotate X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      let y1 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;
      // Perspective
      const perspective = 600;
      const scale = perspective / (perspective + z2);
      return { x: x1 * scale + cx, y: y1 * scale + cy, scale };
    }

    function animate() {
      const elapsed = (Date.now() - startTime) / 1000;
      const rotY = elapsed * 0.4;
      const rotX = Math.sin(elapsed * 0.3) * 0.3;

      ctx.clearRect(0, 0, size, size);

      // Draw grid background
      ctx.strokeStyle = "rgba(0, 255, 136, 0.03)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < size; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }

      // Project vertices
      const projected = baseVertices.map((v) =>
        project(v.x, v.y, v.z, rotY, rotX)
      );

      // Draw routing pulses (data flowing between nodes)
      const pulsePhase = (elapsed * 2) % 3;
      for (let i = 0; i < 3; i++) {
        const from = projected[i];
        const to = projected[(i + 1) % 3];
        const t = ((pulsePhase - i + 3) % 3) / 3;
        if (t > 0 && t < 1) {
          const px = from.x + (to.x - from.x) * t;
          const py = from.y + (to.y - from.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#00ccff";
          ctx.shadowColor = "#00ccff";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw edges
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#00ff88";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const from = projected[i];
        const to = projected[(i + 1) % 3];
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw inner triangle (brass)
      const innerScale = 0.5;
      const innerProjected = baseVertices.map((v) =>
        project(v.x * innerScale, v.y * innerScale, v.z, rotY, rotX)
      );
      ctx.strokeStyle = "#b08840";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const from = innerProjected[i];
        const to = innerProjected[(i + 1) % 3];
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw vertices with labels
      projected.forEach((p, i) => {
        // Vertex dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? "#ff3366" : i === 1 ? "#00ccff" : "#b08840";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillStyle = i === 0 ? "#ff3366" : i === 1 ? "#00ccff" : "#b08840";
        ctx.textAlign = "center";
        const labelY = i === 0 ? p.y - 14 : p.y + 18;
        ctx.fillText(baseVertices[i].label, p.x, labelY);
      });

      // Center text
      const pulse = Math.sin(elapsed * 3) * 0.3 + 0.7;
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(0, 255, 136, ${pulse})`;
      ctx.textAlign = "center";
      ctx.fillText("DORITO TRIANGLE", cx, cy + 2);
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(176, 136, 64, ${pulse * 0.8})`;
      ctx.fillText("3-DOMAIN SHIELD", cx, cy + 14);

      animRef.current = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className="mx-auto"
    />
  );
}
