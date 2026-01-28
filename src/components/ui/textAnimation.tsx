'use client'
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, ReactNode } from 'react';

type TextAnimationProps = {
  children: ReactNode;
};

function TextAnimation({ children }: TextAnimationProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  return (
    <div className="overflow-hidden pb-5" ref={ref}>
      <motion.div
        variants={{
          hidden: {
            y: '200%',
            transition: {
              ease: [0.455, 0.03, 0.515, 0.955],
              duration: 0.85,
              staggerChildren: 0.1,
            },
          },
          visible: {
            y: 0,
            transition: {
              ease: [0.455, 0.03, 0.515, 0.955],
              duration: 0.75,
              staggerChildren: 0.75,
            },
          },
        }}
        initial="hidden"
        animate={controls}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default TextAnimation;
