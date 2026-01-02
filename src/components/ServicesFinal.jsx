import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const SERVICES_DATA = [
  {
    id: 1,
    title: 'Sofás',
    desc: 'Limpeza profunda e remoção de manchas difíceis',
    img: '/assets/sofa_depois.jpg',
    features: ['Remoção de manchas', 'Eliminação de odores', 'Proteção antimofo']
  },
  {
    id: 2,
    title: 'Colchões',
    desc: 'Higienização e eliminação de ácaros e bactérias',
    img: '/assets/colchao_depois.jpg',
    features: ['Anti-ácaros', 'Antialérgico', 'Secagem rápida']
  },
  {
    id: 3,
    title: 'Tapetes',
    desc: 'Lavagem profissional e restauração de cores',
    img: '/assets/tapete.jpg',
    features: ['Restauração de cores', 'Remoção de manchas', 'Proteção UV']
  },
  {
    id: 4,
    title: 'Banco de carro',
    desc: 'Limpeza delicada para tecidos sensíveis',
    img: '/assets/carro_depois.jpg',
    features: ['Cuidado especial', 'Sem danos ao tecido', 'Perfume natural']
  },
  {
    id: 5,
    title: 'Poltronas',
    desc: 'Revitalização completa de poltronas e cadeiras',
    img: '/assets/cadeira_depois.jpg',
    price: 'R$ 69,90',
    features: ['Restauração', 'Limpeza profunda', 'Hidratação do couro']
  },
]

const ServiceCard = React.memo(({ service, index, onRequestQuote }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={service.img}
          alt={`Serviço de higienização de ${service.title.toLowerCase()}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
        <p className="text-gray-600 mb-4">{service.desc}</p>

        {/* Features */}
        <ul className="space-y-2 mb-6" role="list">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 ... z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRequestQuote(service.title)}
          className="w-full px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          aria-label={`Solicitar orçamento para ${service.title}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998..." />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span>Solicitar Orçamento</span>
        </motion.button>
      </div>
    </motion.article>
  )
})

ServiceCard.displayName = 'ServiceCard'

export default function Services() {
  const handleRequestQuote = (serviceTitle) => {
    const message = `Olá! Gostaria de solicitar um orçamento para o serviço de ${serviceTitle}.`
    const whatsappUrl = `https://wa.me/5561981582388?text=${encodeURIComponent(message)}`
    // Aberto corretamente, texto incluído após encodeURIComponent
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const memoizedServices = useMemo(() => SERVICES_DATA, [])

  return (
    <section
      id="servicos"
      className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="services-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2
            id="services-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Nossos Serviços
          </h2>
          <p className="text-lg text-gray-600">
            Atendimento residencial e corporativo com produtos biodegradáveis{' '}
            e equipamentos de última geração.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memoizedServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onRequestQuote={handleRequestQuote}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">Não encontrou o serviço que procura?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRequestQuote('outros serviços')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>Entre em Contato</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
