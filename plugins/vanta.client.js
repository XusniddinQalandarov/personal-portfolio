import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      vantaNet: (element, options = {}) => {
        const defaultOptions = {
          el: element,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x00ffff,
          points: 10.00,
          maxDistance: 20.00,
          spacing: 15.00,
        };
        
        // Merge options, with passed options taking priority
        return NET({
          ...defaultOptions,
          ...options
        }); 
      }
    }
  };
});
