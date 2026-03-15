'use client';

import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const initGSAP = async () => {
      try {
        const gsapModule = await import('gsap');
        const scrollTriggerModule = await import('gsap/ScrollTrigger');

        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        if (!ref.current) return;

        const elements = ref.current.querySelectorAll(
          '.gsap-hidden, .gsap-hidden-left, .gsap-hidden-right, .gsap-scale-hidden'
        );

        if (elements.length === 0) return;

        ctx = gsap.context(() => {
          elements.forEach((el) => {
            type AnimVars = { opacity: number; y?: number; x?: number; scale?: number };
            let fromVars: AnimVars = { opacity: 0 };

            if (el.classList.contains('gsap-hidden')) {
              fromVars = { opacity: 0, y: 60 };
            } else if (el.classList.contains('gsap-hidden-left')) {
              fromVars = { opacity: 0, x: -60 };
            } else if (el.classList.contains('gsap-hidden-right')) {
              fromVars = { opacity: 0, x: 60 };
            } else if (el.classList.contains('gsap-scale-hidden')) {
              fromVars = { opacity: 0, scale: 0.85 };
            }

            gsap.fromTo(el, fromVars, {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            });
          });
        }, ref.current);
      } catch (error) {
        console.warn('GSAP animation failed to initialize:', error);
        // Fallback: make elements visible
        if (ref.current) {
          const elements = ref.current.querySelectorAll(
            '.gsap-hidden, .gsap-hidden-left, .gsap-hidden-right, .gsap-scale-hidden'
          );
          elements.forEach((el) => {
            (el as HTMLElement).style.opacity = '1';
            (el as HTMLElement).style.transform = 'none';
          });
        }
      }
    };

    initGSAP();

    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, []);

  return ref;
}

export function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const initParallax = async () => {
      try {
        const gsapModule = await import('gsap');
        const scrollTriggerModule = await import('gsap/ScrollTrigger');

        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        if (!ref.current) return;

        ctx = gsap.context(() => {
          gsap.to(ref.current, {
            yPercent: -30 * speed * 10,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }, ref.current);
      } catch (error) {
        console.warn('GSAP parallax failed to initialize:', error);
      }
    };

    initParallax();

    return () => {
      if (ctx) {
        ctx.revert();
      }
    };
  }, [speed]);

  return ref;
}