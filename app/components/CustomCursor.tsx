'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      moveX(e.clientX);
      moveY(e.clientY);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor-hover]')) setHovering(true);
    };
    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor-hover]')) setHovering(false);
    };

    window.addEventListener('mouseover', onEnter);
    window.addEventListener('mouseout', onLeave);
    return () => {
      window.removeEventListener('mouseover', onEnter);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9a2d1e]/70 pointer-events-none z-9999 hidden md:flex items-center justify-center transition-[width,height,background-color,box-shadow] duration-300 ease-out"
      style={{
        width: hovering ? '64px' : '36px',
        height: hovering ? '64px' : '36px',
        backgroundColor: hovering ? 'rgba(124,21,21,0.08)' : 'transparent',
        boxShadow: hovering ? '0 0 15px rgba(124,21,21,0.25)' : 'none',
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#9a2d1e]" />
    </div>
  );
}