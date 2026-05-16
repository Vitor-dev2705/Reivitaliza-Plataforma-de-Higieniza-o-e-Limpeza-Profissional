import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import * as api from '../api'
import { uploadFile } from '../supabaseClient'

const Ctx = createContext(null)

export function AdminProvider({ children }) {
  const [isAdmin,     setIsAdmin]     = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [services,    setServices]    = useState([])
  const [extraBlocks, setExtraBlocks] = useState([])
  const [saving,      setSaving]      = useState(false)
  const saveTimer = useRef(null)

  // ── Auth: verifica token salvo ao iniciar ─────────────────────────────────
  useEffect(() => {
    if (api.hasToken()) {
      api.verifyToken()
        .then(data => setIsAdmin(!!data))
        .catch(() => setIsAdmin(false))
        .finally(() => setLoadingAuth(false))
    } else {
      setLoadingAuth(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    await api.login(email, password)
    setIsAdmin(true)
  }, [])

  const logout = useCallback(() => {
    api.logout()
    setIsAdmin(false)
    setServices([])
    setExtraBlocks([])
  }, [])

  // ── Carrega dados ao autenticar ───────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return
    api.fetchServices().then(setServices).catch(console.error)
    api.loadSiteConfig().then(cfg => {
      if (cfg?.extraBlocks) setExtraBlocks(cfg.extraBlocks)
    }).catch(console.error)
  }, [isAdmin])

  // ── Auto-save extraBlocks ─────────────────────────────────────────────────
  const persistBlocks = useCallback((blocks) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      try { await api.saveSiteConfig({ extraBlocks: blocks }) } catch (e) { console.error(e) }
      setSaving(false)
    }, 1200)
  }, [])

  // ── Services ──────────────────────────────────────────────────────────────
  const uploadServiceMedia = useCallback(async (id, field, file) => {
    const ext = file.name.split('.').pop()
    const path = `${id}_${field}_${Date.now()}.${ext}`
    const url = await uploadFile(file, path)
    await api.updateServiceField(id, field, url)
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: url } : s))
    return url
  }, [])

  const clearServiceMedia = useCallback(async (id, field) => {
    await api.updateServiceField(id, field, null)
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: null } : s))
  }, [])

  const addService = useCallback(async () => {
    const svc = await api.createService('Novo Servico', 'Descricao do servico.')
    setServices(prev => [...prev, svc])
  }, [])

  const removeService = useCallback(async (id) => {
    await api.deleteService(id)
    setServices(prev => prev.filter(s => s.id !== id))
  }, [])

  const updateServiceText = useCallback(async (id, field, value) => {
    await api.updateServiceField(id, field, value)
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }, [])

  // ── Extra Blocks ──────────────────────────────────────────────────────────
  const addBlock = useCallback((type) => {
    const block = {
      id: Date.now(),
      type,
      title: type === 'gallery' ? 'Nova Galeria' : type === 'media' ? 'Nova Midia' : 'Novo Bloco',
      items: [],
    }
    setExtraBlocks(prev => {
      const next = [...prev, block]
      persistBlocks(next)
      return next
    })
  }, [persistBlocks])

  const removeBlock = useCallback((id) => {
    setExtraBlocks(prev => {
      const next = prev.filter(b => b.id !== id)
      persistBlocks(next)
      return next
    })
  }, [persistBlocks])

  const updateBlockTitle = useCallback((id, title) => {
    setExtraBlocks(prev => {
      const next = prev.map(b => b.id === id ? { ...b, title } : b)
      persistBlocks(next)
      return next
    })
  }, [persistBlocks])

  const addBlockItem = useCallback(async (blockId, file) => {
    const ext = file.name.split('.').pop()
    const isVideo = file.type.startsWith('video/')
    const path = `blocks/${blockId}_${Date.now()}.${ext}`
    const url = await uploadFile(file, path)
    const item = { id: Date.now(), url, type: isVideo ? 'video' : 'image' }
    setExtraBlocks(prev => {
      const next = prev.map(b => b.id === blockId ? { ...b, items: [...b.items, item] } : b)
      persistBlocks(next)
      return next
    })
    return url
  }, [persistBlocks])

  const removeBlockItem = useCallback((blockId, itemId) => {
    setExtraBlocks(prev => {
      const next = prev.map(b => b.id === blockId ? { ...b, items: b.items.filter(i => i.id !== itemId) } : b)
      persistBlocks(next)
      return next
    })
  }, [persistBlocks])

  const reorderBlocks = useCallback((from, to) => {
    setExtraBlocks(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      persistBlocks(next)
      return next
    })
  }, [persistBlocks])

  return (
    <Ctx.Provider value={{
      session: isAdmin ? { email: 'admin' } : null,
      isAdmin, loadingAuth, login, logout, saving,
      services, uploadServiceMedia, clearServiceMedia, addService, removeService, updateServiceText,
      extraBlocks, addBlock, removeBlock, updateBlockTitle, addBlockItem, removeBlockItem, reorderBlocks,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdmin = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider')
  return ctx
}
