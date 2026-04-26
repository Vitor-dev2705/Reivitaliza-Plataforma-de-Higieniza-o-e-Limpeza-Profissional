import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'

// Renderiza imagem ou vídeo dependendo do que está disponível
function MediaSlot({ imgSrc, videoSrc, alt, label, badge, badgeClass }) {
  const hasVideo = !!videoSrc
  const hasImg   = !!imgSrc

  return (
    <div className="relative bg-gray-100 flex items-center justify-center overflow-hidden">
      {hasVideo ? (
        <video src={videoSrc} className="w-full h-full object-cover absolute inset-0" autoPlay loop muted playsInline />
      ) : hasImg ? (
        <img src={imgSrc} alt={alt} className="w-full h-full object-cover absolute inset-0" />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
          <span className="text-3xl">📷</span>
          <span className="text-xs font-semibold">{label}</span>
        </div>
      )}
      <span className={`absolute top-4 ${badgeClass} text-white text-xs px-5 py-1 rounded-full font-bold tracking-widest z-10 shadow`}>
        {badge}
      </span>
    </div>
  )
}

export default function Services() {
  // Usa os serviços do AdminContext (carregados do Supabase quando admin logado)
  // Para visitantes normais, carrega direto do Supabase também
  const { services: adminServices, isAdmin } = useAdmin()
  const [publicServices, setPublicServices] = useState([])
  const [index, setIndex] = useState(0)

  // Carrega do Supabase para visitantes normais
  useEffect(() => {
    if (isAdmin) return // admin já tem via contexto
    import('../supabaseClient').then(({ supabase }) => {
      supabase.from('services').select('*').order('id').then(({ data }) => {
        if (data && data.length > 0) setPublicServices(data)
      })
    })
  }, [isAdmin])

  const services = isAdmin ? (adminServices.length > 0 ? adminServices : []) : publicServices

  // Carrossel automático
  useEffect(() => {
    if (services.length < 2) return
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % services.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [services.length])

  const safeIndex = Math.min(index, services.length - 1)
  const service   = services[safeIndex]

  const handleWhatsApp = (title) => {
    const msg = `Olá! Gostaria de solicitar um orçamento para o serviço de ${title}.`
    window.open(`https://wa.me/5561981582388?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }

  if (!service) return null

  return (
    <section id="servicos" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Nossos <span className="text-emerald-700">Resultados</span>
        </h2>
        <p className="text-lg text-gray-700">Transformações reais feitas por limpeza profissional</p>
      </div>

      <div className="flex justify-center px-4">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-emerald-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              {/* Imagens / Vídeos Antes & Depois */}
              <div className="grid grid-cols-2 h-[300px]">
                <MediaSlot
                  imgSrc={service.before}
                  videoSrc={service.before_video}
                  alt={`Antes - ${service.title}`}
                  label="Foto Antes"
                  badge="ANTES"
                  badgeClass="left-4 bg-gray-900/80"
                />
                <MediaSlot
                  imgSrc={service.after}
                  videoSrc={service.after_video}
                  alt={`Depois - ${service.title}`}
                  label="Foto Depois"
                  badge="DEPOIS"
                  badgeClass="right-4 bg-emerald-600"
                />
              </div>

              {/* Conteúdo */}
              <div className="p-8 bg-gradient-to-b from-white to-emerald-50">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{service.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleWhatsApp(service.title)}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-extrabold rounded-2xl shadow-lg transition"
                >
                  Solicitar orçamento no WhatsApp
                </motion.button>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-6">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-3 rounded-full transition-all duration-500 ${
                  i === safeIndex ? 'w-8 bg-emerald-600' : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
