import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

const WHATSAPP_NUMBER = '5561981582388'
const WHATSAPP_MESSAGE = 'Olá! Gostaria de solicitar um orçamento.'

export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)
  const [tooltip, setTooltip] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-hide tooltip after 8 seconds
  useEffect(() => {
    if (!tooltip) return
    const timer = setTimeout(() => setTooltip(false), 8000)
    return () => clearTimeout(timer)
  }, [tooltip])

  const handleClick = () => {
    setTooltip(false)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-6 right-6 z-[9000] flex items-center gap-3"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden sm:block bg-white text-gray-800 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap"
              >
                <span>Precisa de ajuda? Fale conosco!</span>
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-transparent border-l-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-16 h-16 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-2xl flex items-center justify-center transition-colors"
            aria-label="Falar no WhatsApp"
          >
            <FaWhatsapp size={32} />

            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
