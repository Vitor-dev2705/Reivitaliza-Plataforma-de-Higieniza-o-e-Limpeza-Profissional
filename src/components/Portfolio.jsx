import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'

// Imagens do portfólio estático (sempre disponíveis)
const STATIC_PORTFOLIO = [
  { id: 's1', url: '/assets/sofa_antes.jpg',    label: 'Sofá - Antes',              type: 'image' },
  { id: 's2', url: '/assets/sofa_depois.jpg',   label: 'Sofá - Depois',             type: 'image' },
  { id: 's3', url: '/assets/colchao_antes.jpg',  label: 'Colchão - Antes',           type: 'image' },
  { id: 's4', url: '/assets/colchao_depois.jpg', label: 'Colchão - Depois',          type: 'image' },
  { id: 's5', url: '/assets/cadeira_antes.jpg',  label: 'Cadeira - Antes',           type: 'image' },
  { id: 's6', url: '/assets/cadeira_depois.jpg', label: 'Cadeira - Depois',          type: 'image' },
  { id: 's7', url: '/assets/banco_sujo.jpg',     label: 'Banco Automotivo - Antes',  type: 'image' },
  { id: 's8', url: '/assets/banco_limpo.jpg',    label: 'Banco Automotivo - Depois', type: 'image' },
]

function Lightbox({ items, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  const item = items[idx]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9990] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-11 h-11 text-xl font-bold backdrop-blur-sm transition">
        ✕
      </button>

      {items.length > 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(p => (p - 1 + items.length) % items.length) }}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-11 h-11 text-2xl font-bold backdrop-blur-sm transition">
          ‹
        </button>
      )}

      <div onClick={e => e.stopPropagation()} className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center px-14">
        <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
          {item.type === 'video' ? (
            <video src={item.url} className="max-w-full max-h-[80vh] rounded-xl shadow-2xl" controls autoPlay />
          ) : (
            <img src={item.url} alt={item.label || ''} className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl" />
          )}
        </motion.div>
        {item.label && (
          <p className="mt-4 text-white/70 text-sm font-medium">{item.label}</p>
        )}
      </div>

      {items.length > 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(p => (p + 1) % items.length) }}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-11 h-11 text-2xl font-bold backdrop-blur-sm transition">
          ›
        </button>
      )}

      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
        {idx + 1} / {items.length}
      </span>
    </motion.div>
  )
}

export default function Portfolio() {
  const { services: adminServices, isAdmin } = useAdmin()
  const [publicServices, setPublicServices] = useState([])
  const [lightbox, setLightbox] = useState(null)
  const [filter, setFilter] = useState('todos')

  // Carrega servicos do Neon via API para construir o portfolio
  useEffect(() => {
    if (isAdmin) return
    import('../api').then(api => {
      api.fetchServices().then(data => {
        if (data) setPublicServices(data)
      })
    }).catch(() => {})
  }, [isAdmin])

  const supaServices = isAdmin ? adminServices : publicServices

  // Monta a lista de imagens do portfólio
  const dynamicItems = supaServices.flatMap(svc => {
    const items = []
    if (svc.before) items.push({ id: `d-b-${svc.id}`, url: svc.before, label: `${svc.title} - Antes`, type: 'image', category: 'antes' })
    if (svc.after) items.push({ id: `d-a-${svc.id}`, url: svc.after, label: `${svc.title} - Depois`, type: 'image', category: 'depois' })
    if (svc.before_video) items.push({ id: `d-bv-${svc.id}`, url: svc.before_video, label: `${svc.title} - Vídeo Antes`, type: 'video', category: 'antes' })
    if (svc.after_video) items.push({ id: `d-av-${svc.id}`, url: svc.after_video, label: `${svc.title} - Vídeo Depois`, type: 'video', category: 'depois' })
    return items
  })

  // Se tem items dinâmicos usa eles, senão usa os estáticos
  const staticWithCategories = STATIC_PORTFOLIO.map(item => ({
    ...item,
    category: item.label.includes('Antes') ? 'antes' : 'depois'
  }))

  const allItems = dynamicItems.length > 0 ? dynamicItems : staticWithCategories

  const filteredItems = filter === 'todos'
    ? allItems
    : allItems.filter(item => item.category === filter)

  if (allItems.length === 0) return null

  const FILTERS = [
    { id: 'todos',  label: 'Todos' },
    { id: 'antes',  label: 'Antes' },
    { id: 'depois', label: 'Depois' },
  ]

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Galeria de <span className="text-emerald-600">Trabalhos</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Confira os resultados reais do nosso trabalho. Clique nas fotos para ampliar.
          </p>
        </motion.div>

        {/* Filtros */}
        <div className="flex justify-center gap-2 mb-10">
          {FILTERS.map(f => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow group"
                onClick={() => setLightbox({ items: filteredItems, startIdx: i })}
              >
                {item.type === 'video' ? (
                  <>
                    <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt={item.label || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Label overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium truncate">{item.label}</p>
                </div>

                {/* Category badge */}
                <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  item.category === 'antes'
                    ? 'bg-gray-900/70 text-white'
                    : 'bg-emerald-600/80 text-white'
                }`}>
                  {item.category === 'antes' ? 'Antes' : 'Depois'}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            items={lightbox.items}
            startIdx={lightbox.startIdx}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
