import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEdit3, FiLogOut } from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import AdminPanel from './AdminPanel'

// ── Login Modal ──────────────────────────────────────────────────────────────
function LoginModal({ onClose, onSuccess }) {
  const { login } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Email ou senha incorretos.')
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition text-black"
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

// ── Botão flutuante de edição (só quando admin logado) ───────────────────────
function AdminFloatingButton({ onOpenPanel, onLogout }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 left-6 z-[8999] flex flex-col-reverse items-start gap-2"
    >
      {/* Menu expandido */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.05 }}
              onClick={() => { setExpanded(false); onOpenPanel() }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors"
            >
              <FiEdit3 size={16} />
              <span>Editar Site</span>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={() => { setExpanded(false); onLogout() }}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors"
            >
              <FiLogOut size={16} />
              <span>Sair</span>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Botão principal */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setExpanded(prev => !prev)}
        className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-colors ${
          expanded ? 'bg-gray-700 hover:bg-gray-800' : 'bg-emerald-600 hover:bg-emerald-700'
        } text-white`}
        aria-label="Menu admin"
      >
        {expanded ? (
          <span className="text-lg font-bold">✕</span>
        ) : (
          <FiEdit3 size={20} />
        )}
      </motion.button>
    </motion.div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────
// Gatilhos secretos:
//   1. Tocar 5x no "REIVITALIZA" no footer (veja FooterFinal.jsx)
//   2. Atalho Ctrl+Shift+A
//   3. Se já logado, botão flutuante aparece automaticamente
export default function HiddenAdmin() {
  const { isAdmin, logout } = useAdmin()
  const [showLogin, setShowLogin] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  // Atalho de teclado: Ctrl+Shift+A
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        if (isAdmin) {
          setShowPanel(true)
        } else {
          setShowLogin(true)
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isAdmin])

  // Listener para o gatilho do footer (evento customizado)
  useEffect(() => {
    const handleSecretTap = () => {
      if (isAdmin) {
        setShowPanel(true)
      } else {
        setShowLogin(true)
      }
    }
    window.addEventListener('reivitaliza-admin-trigger', handleSecretTap)
    return () => window.removeEventListener('reivitaliza-admin-trigger', handleSecretTap)
  }, [isAdmin])

  const handleLogout = useCallback(async () => {
    await logout()
    setShowPanel(false)
  }, [logout])

  return (
    <>
      {/* Botão flutuante (só quando admin logado) */}
      {isAdmin && (
        <AdminFloatingButton
          onOpenPanel={() => setShowPanel(true)}
          onLogout={handleLogout}
        />
      )}

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSuccess={() => { setShowLogin(false); setShowPanel(true) }}
          />
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {showPanel && isAdmin && (
          <AdminPanel onClose={() => setShowPanel(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
