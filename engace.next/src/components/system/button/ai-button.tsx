import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Loader2, LucideIcon, Sparkle } from "lucide-react";
import { loadFull } from "tsparticles";

import type { ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { cn } from "@/lib/utils";

interface AiButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children?: React.ReactNode;
  loadingText?: string;
  icon?: LucideIcon;
  hideSparkles?: boolean;
  variant?: 'default' | 'gradient';
}

const options: ISourceOptions = {
  key: "star",
  name: "Star",
  particles: {
    number: {
      value: 20,
      density: {
        enable: false,
      },
    },
    color: {
      value: ["#7c3aed", "#bae6fd", "#a78bfa", "#93c5fd", "#0284c7", "#fafafa", "#38bdf8"],
    },
    shape: {
      type: "star",
      options: {
        star: {
          sides: 4,
        },
      },
    },
    opacity: {
      value: 0.8,
    },
    size: {
      value: { min: 1, max: 4 },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      enable: true,
      direction: "clockwise",
      animation: {
        enable: true,
        speed: 10,
        sync: false,
      },
    },
    links: {
      enable: false,
    },
    reduceDuplicates: true,
    move: {
      enable: true,
      center: {
        x: 120,
        y: 45,
      },
    },
  },
  interactivity: {
    events: {},
  },
  smooth: true,
  fpsLimit: 120,
  background: {
    color: "transparent",
    size: "cover",
  },
  fullScreen: {
    enable: false,
  },
  detectRetina: true,
  absorbers: [
    {
      enable: true,
      opacity: 0,
      size: {
        value: 1,
        density: 1,
        limit: {
          radius: 5,
          mass: 5,
        },
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
  emitters: [
    {
      autoPlay: true,
      fill: true,
      life: {
        wait: true,
      },
      rate: {
        quantity: 5,
        delay: 0.5,
      },
      position: {
        x: 110,
        y: 45,
      },
    },
  ],
};

export default function AiButton({ 
  loading = false,
  disabled,
  className,
  children = "Generate thumbnails",
  loadingText = "Đang xử lý...",
  icon,
  hideSparkles = false,
  variant = 'default',
  onClick,
  ...props 
}: AiButtonProps) {
  const [particleState, setParticlesReady] = useState<"loaded" | "ready">();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setParticlesReady("loaded");
    });
  }, []);

  const modifiedOptions = useMemo(() => {
    options.autoPlay = isHovering;
    return options;
  }, [isHovering]);

  const isDisabled = loading || disabled;

  const renderSparkles = () => {
    if (hideSparkles) return null;
    return (
      <>
        <Sparkle
          style={{
            animationDelay: "1s",
          }}
          className="absolute bottom-2.5 left-3.5 z-20 size-2 rotate-12 animate-sparkle fill-white"
        />
        <Sparkle
          style={{
            animationDelay: "1.5s",
            animationDuration: "2.5s",
          }}
          className="absolute left-5 top-2.5 size-1 -rotate-12 animate-sparkle fill-white"
        />
        <Sparkle
          style={{
            animationDelay: "0.5s",
            animationDuration: "2.5s",
          }}
          className="absolute left-3 top-3 size-1.5 animate-sparkle fill-white"
        />
      </>
    );
  };

  const buttonStyles = {
    default: "bg-gradient-to-r from-blue-300/30 via-blue-500/30 via-40% to-purple-500/30",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl"
  };

  const innerStyles = {
    default: "bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500",
    gradient: "bg-transparent"
  };

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        "group relative rounded-full p-1 text-white transition-transform hover:scale-105 active:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 cursor-pointer",
        buttonStyles[variant],
        className
      )}
      onMouseEnter={() => !isDisabled && setIsHovering(true)}
      onMouseLeave={() => !isDisabled && setIsHovering(false)}
      {...props}
    >
      <div className={cn(
        "relative flex items-center justify-center gap-2 rounded-full px-4 py-2 text-white",
        innerStyles[variant]
      )}>
        {loading ? (
          <>
            <Loader2 className="size-6 animate-spin" />
             {renderSparkles()}
            <span className="font-semibold">{loadingText}</span>
          </>
        ) : (
          <>
            {icon && React.createElement(icon, { className: "size-6" })}
            {renderSparkles()}
            <span className="font-semibold">{children}</span>
          </>
        )}
      </div>
      {!!particleState && !isDisabled && (
        <Particles
          id="whatever"
          className={`pointer-events-none absolute -bottom-2 -left-2 -right-2 -top-2 z-0 opacity-0 transition-opacity ${particleState === "ready" ? "group-hover:opacity-60" : ""}`}
          particlesLoaded={async () => {
            setParticlesReady("ready");
          }}
          options={modifiedOptions}
        />
      )}
    </button>
  );
}

