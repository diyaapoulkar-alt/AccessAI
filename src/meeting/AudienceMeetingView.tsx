import { Users, Mic, MicOff } from "lucide-react";
import { useEffect, useRef } from "react";

export default function AudienceMeetingView() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
      useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();

      for (let x = 0; x < width; x += 4) {
        const y =
          height / 2 +
          Math.sin(x * 0.04 + time) * 18 +
          Math.sin(x * 0.09 + time * 1.5) * 8;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = "#28e98c";
      ctx.lineWidth = 2;
      ctx.stroke();

      time += 0.05;
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrame);
  }, []);
  return (
    <section className="mt-8 rounded-2xl border border-neutral-800 bg-[#0d1117] p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Accessible Meeting View
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Audience-focused meeting interface
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Users size={18} />
          <span>Audience View</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="min-h-[260px] rounded-xl border border-neutral-700 bg-[#11161d] p-4">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 text-2xl font-bold text-[#28e98c]">
                AI
              </div>

              <p className="mt-4 font-semibold text-white">
                Speaker
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Presenter
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-[260px] rounded-xl border border-neutral-700 bg-[#11161d] p-4">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 text-2xl font-bold text-blue-400">
                AU
              </div>

              <p className="mt-4 font-semibold text-white">
                Audience
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Participant
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-700 bg-[#11161d] px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-neutral-300">
          <Mic size={18} className="text-[#28e98c]" />
          <span>Audio channel active</span>
        </div>

        <MicOff size={18} className="text-neutral-500" />
      </div>
            <div className="mt-4 rounded-xl border border-neutral-700 bg-[#11161d] p-4">
        <p className="mb-2 text-sm text-neutral-400">
          Audio activity
        </p>

        <canvas
          ref={canvasRef}
          width={600}
          height={100}
          className="h-24 w-full rounded-lg"
          aria-label="Animated audio activity visualizer"
        />
      </div>
    </section>
  );
}