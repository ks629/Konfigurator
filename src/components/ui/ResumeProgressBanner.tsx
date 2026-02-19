'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowRight } from 'lucide-react';
import { useConfigurator } from '@/hooks/useConfigurator';

export function ResumeProgressBanner() {
  const [show, setShow] = useState(false);
  const { currentStep, reset } = useConfigurator();

  useEffect(() => {
    if (currentStep > 1) {
      setShow(true);
    }
  }, []);

  const handleReset = () => {
    reset();
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-gradient-to-r from-[#B5005D]/15 to-[#FF004E]/10 border border-[#B5005D]/30 rounded-xl p-4 mb-6 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-300">
              Masz niedokończoną konfigurację{' '}
              <span className="text-white font-medium">(krok {currentStep}/5)</span>.
              Kontynuować?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShow(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#B5005D] hover:bg-[#D4006E] rounded-lg transition-colors"
              >
                Kontynuuj
                <ArrowRight className="h-3 w-3" />
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Od nowa
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
