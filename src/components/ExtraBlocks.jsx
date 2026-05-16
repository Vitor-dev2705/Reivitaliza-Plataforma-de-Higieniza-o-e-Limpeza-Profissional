import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ items, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  const item = items[idx]

  const goPrev = (e) => { e.stopPropagation(); setIdx(p => (p - 1 + items.length) % items.length) }
  const goNext = (e) => { e.stopPropagation(); setIdx(p => (p + 1) % items.length) }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9990] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Fechar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-11 h-11 text-xl font-bold backdrop-blur-sm transition"
      >
        ✕
      </button>

      {/* Anterior */}
      {items.length > 1 && (
        <button
          onClick={goPrev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-11 h-11 text-2xl font-bold backdrop-blur-sm transition"
        >
          ‹
        </button>
      )}

      {/* Mídia */}
      <div onClick={e => e.stopPropagation()} className="max-w-5xl max-h-[85vh] flex items-center justify-center px-14">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {item.type === 'video' ? (
            <video
              src={item.url}
              className="max-w-full max-h-[85vh] rounded-xl shadow-2xl"
              controls
              autoPlay
            />
          ) : (
            <img
              src={item.url}
              alt=""
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            />
          )}
        </motion.div>
      </div>

      {/* Próximo */}
      {items.length > 1 && (
        <button
          onClick={goNext}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-11 h-11 text-2xl font-bold backdrop-blur-sm transition"
        >
          ›
        </button>
      )}

      {/* Contador */}
      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
        {idx + 1} / {items.length}
      </span>
    </motion.div>
  )
}

// ── Gallery Item ─────────────────────────────────────────────────────────────
function GalleryItem({ item, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 group"
      onClick={onClick}
    >
      {item.type === 'video' ? (
        <>
          <video
            src={item.url}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      ) : (
        <>
          <img
            src={item.url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-1.5 text-white text-xs font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <span>Ampliar</span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

// ── Componente Principal ─────────────────────────────────────────────────────
export default function ExtraBlocks() {
  const { extraBlocks } = useAdmin()
  const [lightbox, setLightbox] = useState(null)

  if (!extraBlocks || extraBlocks.length === 0) return null

  return (
    <>
      {extraBlocks.map(block => {
        if (!block.items || block.items.length === 0) return null

        return (
          <section
            key={block.id}
            className="py-14 sm:py-20 bg-gradient-to-b from-white to-gray-50"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Título */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 sm:mb-12"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
                  {block.title}
                </h2>
                <p className="text-gray-500 text-sm">
                  {block.items.length} {block.items.length === 1 ? 'foto' : 'fotos e vídeos'} do nosso trabalho
                </p>
              </motion.div>

              {/* Grid de fotos/vídeos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
                {block.items.map((item, i) => (
                  <GalleryItem
                    key={item.id}
                    item={item}
                    index={i}
                    onClick={() => setLightbox({ items: block.items, startIdx: i })}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}

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
    </>
  )
}
