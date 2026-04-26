import React from 'react'
import { motion } from 'framer-motion'

const STEPS_DATA = [
  {
    id: 1,
    number: '01',
    title: 'Solicitar Orçamento',
    text: 'Envie detalhes do serviço pelo WhatsApp e receba uma estimativa personalizada em minutos.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )
  },
  {
    id: 2,
    number: '02',
    title: 'Agendamento',
    text: 'Escolha a data e horário que melhor se adequam à sua rotina. Total flexibilidade.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 3,
    number: '03',
    title: 'Execução',
    text: 'Realizamos o serviço com cuidado, profissionalismo e produtos sustentáveis.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
]

const StepCard = React.memo(({ step, index, isLast }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
    className="relative"
  >
    {/* Connecting line (desktop only) */}
    {!isLast && (
      <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-sky-200 via-sky-300 to-transparent -z-10" />
    )}

    <div className="relative group">
      {/* Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-sky-200">
        {/* Number Badge */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
          {step.number}
        </div>

        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl mb-6"
        >
          {step.icon}
        </motion.div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
        <p className="text-gray-600 leading-relaxed">{step.text}</p>

        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  </motion.div>
))

StepCard.displayName = 'StepCard'

export default function Steps() {
  return (
    <section
      id="como-funciona"
      className="py-16 sm:py-24 bg-gradient-to-b from-white via-sky-50 to-white"
      aria-labelledby="steps-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2
            id="steps-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Como Funciona
          </h2>
          <p className="text-lg text-gray-600">
            Processo simples e transparente em apenas 3 passos
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {STEPS_DATA.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              isLast={index === STEPS_DATA.length - 1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const whatsappUrl = `https://wa.me/5561981582388?text=${encodeURIComponent('Olá! Gostaria de iniciar um orçamento.')}`
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>Começar Agora</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
