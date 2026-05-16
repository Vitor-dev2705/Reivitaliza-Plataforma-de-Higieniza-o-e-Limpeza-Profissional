import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Link público para avaliar no Google
const GOOGLE_REVIEW_URL = "https://g.page/r/CXd-5puVhaP-EAE/review";

export default function TestimonialsFinal() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    async function loadReviews() {
      let allReviews = [];

      // 1. Tenta carregar reviews do banco (admin gerencia)
      try {
        const api = await import('../api');
        const dbReviews = await api.fetchReviews();
        if (dbReviews && dbReviews.length > 0) {
          const formatted = dbReviews
            .filter(r => r.visible !== false)
            .map(r => ({
              id: r.id,
              name: r.name || 'Cliente',
              photo: r.photo_url || '',
              rating: r.rating || 5,
              text: r.text || '',
              source: r.source || 'manual',
              time: '',
            }));
          allReviews = [...allReviews, ...formatted];
        }
      } catch (err) {
        console.warn("Erro ao buscar reviews do banco:", err);
      }

      // 2. Tenta carregar reviews do Google (se API configurada)
      try {
        const res = await fetch("/.netlify/functions/google-reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length > 0) {
            const googleFormatted = data.reviews
              .filter(r => r.text && r.text.trim())
              .map((r, i) => ({
                id: `google_${i}`,
                name: r.author_name || "Cliente Google",
                photo: r.profile_photo_url || '',
                rating: r.rating || 5,
                text: r.text || '',
                source: 'google',
                time: r.relative_time_description || '',
              }));
            allReviews = [...allReviews, ...googleFormatted];
          }
        }
      } catch {
        // Google API não configurada, sem problema
      }

      setReviews(allReviews);
      setLoading(false);
    }

    loadReviews();
  }, []);

  // Carrossel automático
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [reviews]);

  const goTo = useCallback((idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(prev => prev === 0 ? reviews.length - 1 : prev - 1);
  }, [reviews.length]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const handleRedirectToGoogle = () => {
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  // Calcula media de estrelas
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
            <div className="h-48 bg-gray-100 rounded-3xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!reviews.length) {
    return (
      <section id="avaliacoes" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Avaliações dos Clientes</h2>
          <p className="text-gray-500 mb-10">Ainda não temos avaliações cadastradas.</p>

          {/* CTA para avaliar */}
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <h3 className="text-2xl font-bold mb-4">Seja o primeiro a avaliar!</h3>
            <button
              onClick={handleRedirectToGoogle}
              className="px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition"
            >
              Avaliar no Google
            </button>
          </div>
        </div>
      </section>
    );
  }

  const review = reviews[currentIndex];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section id="avaliacoes" className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-4"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-emerald-700">{avgRating} de 5.0</span>
            <span className="text-xs text-gray-500">· {reviews.length} avaliação{reviews.length !== 1 ? 'es' : ''}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3"
          >
            O que nossos clientes dizem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Resultados reais de quem confiou na Reivitaliza
          </motion.p>
        </div>

        {/* CARD PRINCIPAL */}
        <div className="relative max-w-3xl mx-auto mb-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 left-6 w-10 h-10 text-emerald-100" />

              {/* Estrelas */}
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Texto */}
              <p className="text-center text-gray-700 text-lg md:text-xl leading-relaxed mb-8 italic max-w-2xl mx-auto">
                "{review.text}"
              </p>

              {/* Autor */}
              <div className="flex items-center justify-center gap-3">
                {review.photo ? (
                  <img
                    src={review.photo}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-200"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <div className="flex items-center gap-2">
                    {review.source === 'google' && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">Google</span>
                    )}
                    {review.time && <span className="text-xs text-gray-400">{review.time}</span>}
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Setas de navegação */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-emerald-50 transition"
                aria-label="Anterior"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-emerald-50 transition"
                aria-label="Próximo"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Dots de navegação */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mb-16">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Avaliação ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* CTA AVALIAR NO GOOGLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-10 text-center border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Gostou do nosso trabalho?</h3>
          <p className="text-gray-500 mb-6">Deixe sua avaliação e ajude outros clientes a nos encontrar!</p>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 transition ${
                    star <= selectedRating ? "fill-yellow-400 text-yellow-400 scale-110" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            disabled={selectedRating === 0}
            onClick={handleRedirectToGoogle}
            className="px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            Avaliar no Google
          </button>
        </motion.div>

      </div>
    </section>
  );
}
