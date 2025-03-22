import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback } from "react";

interface UseFloatAnimationProps {
  rotation?: number;
  timing?: number;
  springConfig?: {
    stiffness?: number;
    damping?: number;
  };
}

export function useFloatAnimation({
  rotation = 2,
  timing = 0.15,
  springConfig = {
    stiffness: 150,
    damping: 15
  }
}: UseFloatAnimationProps = {}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [rotation, -rotation]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-rotation, rotation]),
    springConfig
  );

  const handleMouseMove = useCallback(
    ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
      const { left, top, width, height } = currentTarget.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;

      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return {
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
    transformTemplate: (x: number, y: number) =>
      `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg)`,
  };
}