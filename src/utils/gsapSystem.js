import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const panelTransition = {
  duration: 0.4,
  ease: 'power3.inOut'
};

export const animatePanelEnter = (element, direction = 1) => {
  // Flip Book - Page In
  // Anchor on the left like a book spine
  gsap.fromTo(element, 
    { 
      opacity: 0, 
      rotateY: direction > 0 ? 90 : -90,
      transformPerspective: 1500,
      transformOrigin: 'left center',
      z: -100
    },
    { 
      opacity: 1, 
      rotateY: 0,
      z: 0,
      duration: 0.8, 
      ease: 'back.out(1.2)',
      force3D: true
    }
  );
};

export const animatePanelExit = (element, direction = 1, onComplete) => {
  // Flip Book - Page Out
  gsap.to(element, {
    opacity: 0,
    rotateY: direction > 0 ? -90 : 90,
    transformPerspective: 1500,
    transformOrigin: 'left center',
    z: -100,
    duration: 0.5,
    ease: 'power3.in',
    force3D: true,
    onComplete
  });
};

export const pulseGlow = (element, color) => {
  gsap.fromTo(element, 
    { boxShadow: `0 0 0 0 ${color}` },
    { boxShadow: `0 0 0 4px rgba(0,0,0,0)`, duration: 0.5, ease: 'power2.out' }
  );
};
