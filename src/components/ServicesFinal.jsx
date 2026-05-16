import React, { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { useAdmin } from '../context/AdminContext'

// ── Serviços padrão (fallback quando Supabase está vazio) ────────────────────
const FALLBACK_SERVICES = [
  {
    id: 'fb-1',
    title: 'Higienização de Sofás',
    description: 'Limpeza profunda que remove sujeira, ácaros e bactérias, devolvendo a beleza e o conforto do seu sofá.',
    before: '/assets/sofa_antes.jpg',
    after: '/assets/sofa_depois.jpg',
  },
  {
    id: 'fb-2',
    title: 'Higienização de Colchões',
    description: 'Eliminação de ácaros, fungos e manchas do colchão para noites de sono mais saudáveis.',
    before: '/assets/colchao_antes.jpg',
    after: '/assets/colchao_depois.jpg',
  },
  {
    id: 'fb-3',
    title: 'Limpeza de Cadeiras',
    description: 'Higienização completa de cadeiras estofadas, removendo manchas e odores indesejados.',
    before: '/assets/cadeira_antes.jpg',
    after: '/assets/cadeira_depois.jpg',
  },
  {
    id: 'fb-4',
    title: 'Limpeza de Bancos Automotivos',
    description: 'Revitalize os bancos do seu carro com limpeza profissional que remove manchas difíceis.',
    before: '/assets/banco_sujo.jpg',
    after: '/assets/banco_limpo.jpg',
  },
]

// ── Slider Antes/Depois ──────────────────────────────────────────────────────
function BeforeAfterSlider({ before, after, beforeVideo, afterVideo, title }) {
  const containerRef = useRef(null)
  const [position, setPosition] = useState(50)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onPointerDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    updatePosition(e.clientX)
    containerRef.current?.setPointerCapture(e.pointerId)
  }, [updatePosition])

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return
    e.preventDefault()
    updatePosition(e.clientX)
  }, [updatePosition])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const hasBefore = before || beforeVideo
  const hasAfter = after || afterVideo

  // Se não tem imagens, mostra placeholder
  if (!hasBefore && !hasAfter) {
    return (
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-2xl overflow-hidden">
        <div className="text-center text-gray-400">
          <span className="text-4xl block mb-2">📷</span>
          <span className="text-sm font-medium">Fotos em breve</span>
        </div>
      </div>
    )
  }

  // Se só tem uma das duas, mostra lado a lado estático
  if (!hasBefore || !hasAfter) {
    const src = before || after
    const video = beforeVideo || afterVideo
    return (
      <div className="relative w-full aspect-[4/3] rounded-t-2xl overflow-hidden">
        {video ? (
          <video src={video} className="w-full h-full object-cover" autoPlay loop muted playsInline />
        ) : (
          <img src={src} alt={title} className="w-full h-full object-cover" />
        )}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-t-2xl overflow-hidden cursor-col-resize select-none touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* DEPOIS (fundo completo) */}
      {afterVideo ? (
        <video src={afterVideo} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
      ) : (
        <img src={after} alt={`Depois - ${title}`} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      )}

      {/* ANTES (clipped pela posição do slider) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {beforeVideo ? (
          <video src={beforeVideo} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
        ) : (
          <img src={before} alt={`Antes - ${title}`} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        )}
      </div>

      {/* Linha do slider */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-0.5 h-full bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)]" />
        {/* Handle circular */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-emerald-500">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-4 5 4 5m8-10l4 5-4 5" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 z-10 bg-gray-900/75 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full font-bold tracking-wider uppercase">
        Antes
      </span>
      <span className="absolute top-3 right-3 z-10 bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] px-3 py-1 rounded-full font-bold tracking-wider uppercase">
        Depois
      </span>

      {/* Instrução (aparece só no início) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full font-medium pointer-events-none opacity-70">
        Arraste para comparar
      </div>
    </div>
  )
}

// ── Card de Serviço ──────────────────────────────────────────────────────────
const ServiceCard = React.memo(({ service, index }) => {
  const handleWhatsApp = () => {
    const msg = `Olá! Gostaria de solicitar um orçamento para o serviço de ${service.title}.`
    window.open(`https://wa.me/5561981582388?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      {/* Slider Antes/Depois */}
      <BeforeAfterSlider
        before={service.before}
        after={service.after}
        beforeVideo={service.before_video}
        afterVideo={service.after_video}
        title={service.title}
      />

      {/* Conteúdo */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-1">
          {service.description}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWhatsApp}
          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
        >
          <FaWhatsapp className="text-lg" />
          <span>Solicitar Orçamento</span>
        </motion.button>
      </div>
    </motion.article>
  )
})

ServiceCard.displayName = 'ServiceCard'

// ── Componente Principal ─────────────────────────────────────────────────────
export default function Services() {
  const { services: adminServices, isAdmin } = useAdmin()
  const [publicServices, setPublicServices] = useState([])
  const [loading, setLoading] = useState(true)

  // Carrega do Neon via API para visitantes normais
  useEffect(() => {
    if (isAdmin) {
      setLoading(false)
      return
    }
    import('../api').then(api => {
      api.fetchServices().then(data => {
        if (data && data.length > 0) setPublicServices(data)
        setLoading(false)
      }).catch(() => setLoading(false))
    }).catch(() => setLoading(false))
  }, [isAdmin])

  // Usa admin services se logado, senão public, senão fallback
  const supabaseServices = isAdmin ? adminServices : publicServices
  const services = supabaseServices.length > 0 ? supabaseServices : FALLBACK_SERVICES

  if (loading) {
    return (
      <section id="servicos" className="py-20">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  return (
    <section id="servicos" className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
            Nossos <span className="text-emerald-600">Serviços</span> e Resultados
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Veja as transformações reais feitas pela nossa equipe. Arraste o slider para comparar o antes e depois.
          </p>
        </motion.div>

        {/* Grid de Serviços */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* CTA geral */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">
            Não encontrou o serviço que procura? Entre em contato!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.open(`https://wa.me/5561981582388?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços disponíveis.')}`, '_blank', 'noopener,noreferrer')
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-700 font-semibold rounded-full hover:bg-emerald-50 transition-all shadow-sm"
          >
            <FaWhatsapp className="text-xl" />
            <span>Falar sobre outros serviços</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
