import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    id: 1,
    question: 'Vocês usam produtos tóxicos?',
    answer: 'Não! Priorizamos soluções 100% biodegradáveis e ecológicas. Nossos produtos são seguros para crianças, pets e pessoas com alergias.',
    category: 'Produtos'
  },
  {
    id: 2,
    question: 'Qual o prazo de secagem?',
    answer: 'Depende do item e das condições climáticas, mas normalmente varia entre 6 a 12 horas. Utilizamos técnicas de extração avançadas para acelerar o processo.',
    category: 'Processo w'
  },
  {
    id: 3,
    question: 'Atendem em quais regiões?',
    answer: 'Atendemos em Brasília e entornos.s Para outras localidades, consulte-nos via WhatsApp para verificar disponibilidade.',
    category: 'Atendimento'
  },
  {
    id: 4,
    question: 'Como funciona o agendamento?',
    answer: 'É muito simples! Entre em contato pelo WhatsApp, informe o serviço desejado, escolha data e horário. Confirmamos e enviamos um profissional no dia agendado.',
    category: 'Agendamento'
  },
  {
    id: 5,
    question: 'Vocês removem manchas difíceis?',
    answer: 'Sim! Somos especializados em remoção de manchas complexas como vinho, café, sangue, tinta e muito mais. Utilizamos produtos específicos para cada tipo de mancha.',
    category: 'Serviços'
  },
  {
    id: 6,
    question: 'É seguro para pets e crianças?',
    answer: 'Absolutamente! Todos os nossos produtos são atóxicos e seguros. Após a secagem completa, o ambiente está 100% liberado para uso.',
    category: 'Segurança'
  },
  {
    id: 7,
    question: 'Preciso sair de casa durante o serviço?',
    answer: 'Não é necessário. Nossos profissionais trabalham de forma discreta e organizada. Você pode ficar em casa normalmente durante todo o processo.',
    category: 'Processo'
  },
  {
    id: 8,
    question: 'Oferecem garantia do serviço?',
    answer: 'Sim! Garantimos a satisfação do cliente. Se não ficar satisfeito, refazemos o serviço gratuitamente. Nosso compromisso é com a qualidade.',
    category: 'Garantia'
  },
  {
    id: 9,
    question: 'Com que frequência devo higienizar?',
    answer: 'Recomendamos higienização profissional a cada 6-12 meses para residências e 3-6 meses para ambientes comerciais, dependendo do uso.',
    category: 'Manutenção'
  }
]

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="border-b border-gray-200 last:border-0"
  >
    <button
      onClick={onToggle}
      className="w-full py-6 px-6 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${faq.id}`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full">
            {faq.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 mt-1"
      >
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={`faq-answer-${faq.id}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6">
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

export default function FAQ() {
  const [openId, setOpenId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const categories = ['Todos', ...new Set(FAQS.map(faq => faq.category))]
  
  const filteredFaqs = selectedCategory === 'Todos'
    ? FAQS
    : FAQS.filter(faq => faq.category === selectedCategory)

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50"
      aria-labelledby="faq-title"
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
            id="faq-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            Dúvidas Frequentes
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Encontre respostas para as perguntas mais comuns sobre nossos serviços
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(category)
                  setOpenId(null)
                }}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-sky-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredFaqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-sky-50 rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ainda tem dúvidas?
          </h3>
          <p className="text-gray-600 mb-6">
            Nossa equipe está pronta para ajudar! Entre em contato pelo WhatsApp 
            e tire todas as suas dúvidas.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const whatsappUrl = `https://wa.me/5561981582388?text=${encodeURIComponent('Olá! Tenho algumas dúvidas sobre os serviços.')}`
              window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>Falar no WhatsApp</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
