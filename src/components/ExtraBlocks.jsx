import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'

function Lightbox({ items, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  const item = items[idx]
  return (
    <div className="fixed inset-0 z-[9990] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white bg-white/20 rounded-full w-10 h-10 text-xl font-bold">×</button>
      <button onClick={e => { e.stopPropagation(); setIdx(p => (p - 1 + items.length) % items.length) }}
        className="absolute left-4 text-white bg-white/20 rounded-full w-10 h-10 text-2xl font-bold">‹</button>
      <div onClick={e => e.stopPropagation()} className="max-w-4xl max-h-[85vh] flex items-center justify-center">
        {item.type === 'video'
          ? <video src={item.url} className="max-w-full max-h-[85vh] rounded-xl" controls autoPlay />
          : <img src={item.url} alt="" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
        }
      </div>
      <button onClick={e => { e.stopPropagation(); setIdx(p => (p + 1) % items.length) }}
        className="absolute right-4 text-white bg-white/20 rounded-full w-10 h-10 text-2xl font-bold">›</button>
      <span className="absolute bottom-4 text-white/60 text-sm">{idx + 1} / {items.length}</span>
    </div>
  )
}

export default function ExtraBlocks() {
  const { extraBlocks } = useAdmin()
  const [lightbox, setLightbox] = useState(null)

  if (!extraBlocks || extraBlocks.length === 0) return null

  return (
    <>
      {extraBlocks.map(block => (
        <section key={block.id} className="py-16 px-4 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl font-extrabold text-gray-900 mb-10 text-center"
            >
              {block.title}
            </motion.h2>

            {block.items.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">Nenhum item ainda.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {block.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.03 }}
                    className="aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md relative group"
                    onClick={() => setLightbox({ items: block.items, startIdx: i })}
                  >
                    {item.type === 'video'
                      ? <>
                          <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                            <span className="text-white text-3xl">▶</span>
                          </div>
                        </>
                      : <img src={item.url} alt="" className="w-full h-full object-cover" />
                    }
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      <AnimatePresence>
        {lightbox && (
          <Lightbox items={lightbox.items} startIdx={lightbox.startIdx} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
