import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Mariana Silva',
    role: 'Proprietária Residencial',
    text: 'Serviço excelente! O sofá ficou como novo e o atendimento foi perfeito. A equipe foi super pontual e cuidadosa. Recomendo muito!',
    rating: 5,
    avatar: '👩‍💼',
    location: 'Taguatinga, DF'
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    role: 'Gerente de Facilities',
    text: 'Profissionais extremamente cuidadosos e eficientes. Limparam todos os estofados do escritório em tempo recorde. Resultado impecável!',
    rating: 5,
    avatar: '👨‍💼',
    location: 'Samambaia, DF'
  },
  {
    id: 3,
    name: 'Ana Paula Costa',
    role: 'Mãe e Dona de Casa',
    text: 'Meu colchão tinha manchas difíceis e odores. Ficou perfeito! Produtos sem cheiro forte, ideal para quem tem crianças. Amei!',
    rating: 5,
    avatar: '👩',
    location: 'Luziania, GO'
  },
  {
    id: 4,
    name: 'Roberto Almeida',
    role: 'Empresário',
    text: 'Contratei para higienizar os tapetes persas do meu escritório. Fiquei impressionado com o cuidado e a qualidade do trabalho. Nota 10!',
    rating: 5,
    avatar: '👨',
    location: 'Lago Sul, DF'
  },
  {
    id: 5,
    name: 'Juliana Santos',
    role: 'Veterinária',
    text: 'Tenho 3 cachorros em casa e os estofados sofriam muito. A equipe removeu todos os pelos e odores. Simplesmente perfeito!',
    rating: 5,
    avatar: '👩‍⚕️',
    location: 'Ceilandia, DF'
  }
]

const StarRating = ({ rating }) => (
  <div className="flex gap-1" aria-label={`Avaliação: ${rating} de 5 estrelas`}>
    {[...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

const TestimonialCard = ({ testimonial, isActive }) => (
  <motion.article
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.5 }}
    className={`bg-white rounded-2xl p-8 shadow-xl ${
      isActive ? 'ring-2 ring-sky-500' : ''
    }`}
  >
    {/* Quote Icon */}
    <svg
      className="w-12 h-12 text-sky-200 mb-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>

    {/* Rating */}
    <StarRating rating={testimonial.rating} />

    {/* Testimonial Text */}
    <p className="text-gray-700 text-lg mt-4 mb-6 leading-relaxed italic">
      "{testimonial.text}"
    </p>

    {/* Author Info */}
    <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
      <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center text-3xl">
        {testimonial.avatar}
      </div>
      <div>
        <p className="font-bold text-gray-900">{testimonial.name}</p>
        <p className="text-sm text-gray-600">{testimonial.role}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {testimonial.location}
        </p>
      </div>
    </div>
  </motion.article>
)

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  const goToTestimonial = (index) => {
    setCurrentIndex(index)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000)
  }

  return (
    <section
      id="depoimentos"
      className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="testimonials-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2
            id="testimonials-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-lg text-gray-600">
            Mais de 1.000 clientes satisfeitos em todo o Brasil
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { label: 'Clientes Satisfeitos', value: '1.000+' },
            { label: 'Avaliação Média', value: '5.0 ⭐' },
            { label: 'Anos de Experiência', value: '10+' },
            { label: 'Serviços Realizados', value: '5.000+' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl font-bold text-sky-600 mb-2">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={currentIndex}
              testimonial={TESTIMONIALS[currentIndex]}
              isActive={true}
            />
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-10 h-3 bg-sky-600'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para depoimento ${index + 1}`}
                aria-current={index === currentIndex}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToTestimonial((currentIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
              aria-label="Depoimento anterior"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToTestimonial((currentIndex + 1) % TESTIMONIALS.length)}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
              aria-label="Próximo depoimento"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-600"
        >
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">100% Garantido</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="font-medium">Equipe Certificada</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Produtos Sustentáveis</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
