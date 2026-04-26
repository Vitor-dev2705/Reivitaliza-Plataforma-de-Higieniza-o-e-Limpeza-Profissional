import { motion } from "framer-motion";

export default function Resultados() {
  return (
    <section
      id="resultados"
      className="relative px-6 py-20 bg-gradient-to-b from-[#f9faf7] to-[#eef2e6]"
    >
      <div className="mx-auto max-w-7xl flex flex-col-reverse md:flex-row items-center gap-16">
        
        {/* TEXTO */}
        <div className="max-w-xl flex flex-col gap-6">
          <span className="inline-block w-fit px-4 py-1 rounded-full bg-green-100 text-green-800 text-sm font-bold uppercase tracking-wide">
            Impermeabilização
          </span>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
          >
            Nós cuidamos do seu <span className="text-green-700">investimento</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-700 text-lg leading-relaxed"
          >
            <strong>Impermeabilização profissional</strong> cria uma barreira
            contra líquidos, sujeira e manchas, preservando cores, prolongando a
            vida útil dos tecidos e facilitando a limpeza do dia a dia.
          </motion.p>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href="https://api.whatsapp.com/send?phone=5561981582388&text=Olá! Quero fazer um orçamento de impermeabilização."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center w-fit rounded-full bg-green-700 text-white font-semibold px-8 py-4 shadow-lg hover:bg-green-800 transition"
          >
            Solicitar orçamento
          </motion.a>
        </div>

        {/* VÍDEO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-white rounded-3xl p-4 shadow-2xl"
        >
          <div className="relative w-[320px] h-[420px] md:w-[380px] md:h-[480px] rounded-2xl overflow-hidden border border-green-200">
            <video
              src="/assets/impermeabilizacao.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* detalhe decorativo */}
          <div className="absolute -z-10 inset-0 rounded-3xl bg-green-200 blur-3xl opacity-30" />
        </motion.div>

      </div>
    </section>
  );
}
