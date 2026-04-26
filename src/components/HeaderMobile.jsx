import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiLogIn, FiLogOut, FiEdit3 } from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'

const NAV_ITEMS = [
  { id: 'servicos',      label: 'Serviços' },
  { id: 'como-funciona', label: 'Como Funciona' },
  { id: 'resultados',    label: 'Resultados' },
  { id: 'depoimentos',   label: 'Depoimentos' },
  { id: 'faq',           label: 'Dúvidas Frequentes' },
]

// ── Login Modal ───────────────────────────────────────────────────────────────
function LoginModal({ onClose }) {
  const { login } = useAdmin()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      onClose()
    } catch (err) {
      setError('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
        >×</button>

        {/* Ícone */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-5 text-3xl shadow-lg">
          🔐
        </div>

        <h2 className="text-2xl font-bold text-center text-emerald-700 mb-1">Área do Dono</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Faça login para editar o site</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 px-4 py-3 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          🔒 Apenas o proprietário do site tem acesso
        </p>
      </motion.div>
    </div>
  )
}

// ── Header principal ──────────────────────────────────────────────────────────
export default function Header({ onOpenAdmin }) {
  const { isAdmin, logout } = useAdmin()
  const [open,        setOpen]        = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [showLogin,   setShowLogin]   = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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

  const handleAdminClick = () => {
    setOpen(false)
    if (isAdmin) {
      onOpenAdmin?.()
    } else {
      setShowLogin(true)
    }
  }

  const handleLogout = async () => {
    await logout()
    setOpen(false)
  }

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ y: -100 }} animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Menu principal">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.a href="#" whileTap={{ scale: 0.98 }} className="flex items-center" aria-label="Reivitaliza">
              <img src="/assets/logo.png" alt="Reivitaliza" className="h-20 w-auto object-contain" />
            </motion.a>

            <motion.button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-gray-800 bg-white/90 hover:bg-white shadow"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            >
              <AnimatePresence mode="wait">
                {open ? <FiX size={28} /> : <FiMenu size={28} />}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* SIDE MENU */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-16 sm:top-20 right-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto"
              role="dialog" aria-modal="true"
            >
              <div className="flex flex-col h-full">
                {/* Nav links */}
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

                  {/* Divisor */}
                  <div className="border-t border-gray-100 mt-6 pt-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">
                      {isAdmin ? '✅ Modo Admin Ativo' : 'Área Restrita'}
                    </p>

                    {/* Botão admin / editar */}
                    <motion.li initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }} style={{ listStyle: 'none' }}>
                      <button
                        onClick={handleAdminClick}
                        className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-3 ${
                          isAdmin
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <FiEdit3 size={18} />
                        <span>{isAdmin ? 'Abrir Painel de Edição' : 'Login do Proprietário'}</span>
                      </button>
                    </motion.li>

                    {/* Sair (só quando logado) */}
                    {isAdmin && (
                      <motion.li initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ listStyle: 'none' }}>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all flex items-center gap-3"
                        >
                          <FiLogOut size={18} />
                          <span>Sair do Painel</span>
                        </button>
                      </motion.li>
                    )}
                  </div>
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

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </AnimatePresence>
    </>
  )
}
