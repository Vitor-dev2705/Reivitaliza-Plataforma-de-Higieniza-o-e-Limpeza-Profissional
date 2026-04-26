import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

// Link público para avaliar no Google
const GOOGLE_REVIEW_URL = "https://g.page/r/CXd-5puVhaP-EAE/review";

export default function TestimonialsFinal() {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoogleReviews() {
      try {
        const res = await fetch(".netlify/functions/google-reviews");

        if (!res.ok) throw new Error(`Erro na API: ${res.status}`);

        const data = await res.json();

        if (!data.reviews || data.reviews.length === 0) {
          setReviews([]);
          setTotalReviews(0);
          return;
        }

        const formatted = data.reviews
          .filter((r) => r.text && r.text.trim())
          .map((r) => ({
            name: r.author_name || "Usuário Google",
            photo: r.profile_photo_url || "/avatar-placeholder.png",
            rating: r.rating || 0,
            text: r.text || "",
            time: r.relative_time_description || "",
          }));

        setReviews(formatted);
        setTotalReviews(data.totalRatings || formatted.length);
      } catch (err) {
        console.error("Erro ao buscar avaliações:", err);
        setReviews([]);
        setTotalReviews(0);
      } finally {
        setLoading(false);
      }
    }

    fetchGoogleReviews();
  }, []);

  // Carrossel automático
  useEffect(() => {
    if (!reviews.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews]);

  const handleRedirectToGoogle = () => {
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  if (loading)
    return <p className="text-center py-20 text-gray-500">Carregando avaliações do Google…</p>;

  if (!reviews.length)
    return <p className="text-center py-20 text-gray-500">Nenhuma avaliação disponível no momento.</p>;

  const review = reviews[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* TÍTULO */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Avaliações dos Clientes</h2>
          <p className="text-gray-600">⭐ {totalReviews} avaliações no Google</p>
        </div>

        {/* AVALIAÇÃO EM DESTAQUE */}
        <AnimatePresence mode="wait">
          <motion.article
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-10 shadow-xl mb-16"
          >
            {/* FOTO */}
            <div className="flex justify-center mb-6">
              <img
                src={review.photo}
                alt={review.name}
                className="w-16 h-16 rounded-full object-cover border"
                referrerPolicy="no-referrer"
                onError={(e) => (e.currentTarget.src = "/avatar-placeholder.png")}
              />
            </div>

            {/* ESTRELAS */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* TEXTO */}
            <p className="text-center text-gray-700 italic mb-6">“{review.text}”</p>

            {/* NOME */}
            <div className="text-center">
              <p className="font-bold text-gray-900">{review.name}</p>
              <p className="text-xs text-gray-500">{review.time}</p>
            </div>
          </motion.article>
        </AnimatePresence>

        {/* AVALIAR NO GOOGLE */}
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-4">Avalie nossa empresa no Google</h3>

          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-10 w-10 transition ${
                    star <= selectedRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            disabled={selectedRating === 0}
            onClick={handleRedirectToGoogle}
            className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-40"
          >
            Avaliar no Google
          </button>
        </div>
      </div>
    </section>
  );
}
