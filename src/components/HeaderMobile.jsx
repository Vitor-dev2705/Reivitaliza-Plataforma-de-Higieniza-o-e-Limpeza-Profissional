import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

const NAV_ITEMS = [
  { id: 'servicos',      label: 'Serviços' },
  { id: 'portfolio',     label: 'Trabalhos' },
  { id: 'como-funciona', label: 'Como Funciona' },
  { id: 'resultados',    label: 'Resultados' },
  { id: 'depoimentos',   label: 'Depoimentos' },
  { id: 'faq',           label: 'Dúvidas' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  const handleNavClick = useCallback((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }, [])

  const handleOrcamentoClick = useCallback(() => {
    window.open(`https://wa.me/5561981582388?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento.')}`, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }} animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Menu principal">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.a href="#" whileTap={{ scale: 0.98 }} className="flex items-center flex-shrink-0" aria-label="Reivitaliza">
            <img src="/assets/logo.png" alt="Reivitaliza" className="h-12 lg:h-14 w-auto object-contain" />
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'text-emerald-700 bg-emerald-50'
                    : scrolled
                      ? 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-white/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOrcamentoClick}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              <FaWhatsapp className="text-lg" />
              <span>Orçamento</span>
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <motion.button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-gray-800 bg-white/90 hover:bg-white shadow"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            <AnimatePresence mode="wait">
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* MOBILE SIDE MENU */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-x-0 top-16 bottom-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto lg:hidden"
              role="dialog" aria-modal="true"
            >
              <div className="flex flex-col h-full">
                <nav className="flex-1 py-8 px-6">
                  <ul className="space-y-1">
                    {NAV_ITEMS.map((item, i) => (
                      <motion.li key={item.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                        <button
                          onClick={() => handleNavClick(item.id)}
                          className="w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition-all flex items-center justify-between"
                        >
                          <span>{item.label}</span>
                          <span className="text-gray-400">›</span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* CTA WhatsApp */}
                <div className="p-6 border-t border-gray-100">
                  <button
                    onClick={handleOrcamentoClick}
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg transition"
                  >
                    Solicitar Orçamento
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
