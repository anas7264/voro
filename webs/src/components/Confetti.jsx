import React, { useEffect, forwardRef } from 'react';
import confetti from 'canvas-confetti';

const Confetti = forwardRef((props, ref) => {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#7C3AED', '#10B981', '#F59E0B'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#7C3AED', '#10B981', '#F59E0B'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return null;
});

Confetti.displayName = 'Confetti';

export default Confetti;
