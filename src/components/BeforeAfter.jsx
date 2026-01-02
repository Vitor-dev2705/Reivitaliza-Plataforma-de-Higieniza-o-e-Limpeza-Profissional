import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Resultados() {
  const dragRef = useRef();
  const containerRef = useRef();
  const [divider, setDivider] = useState(50);

  const items = [
    {
      id: 1,
      before: "/public/assets/colchao_antes.jpg",
      after: "/public/assets/colchao_depois.jpg",
    },
  ];

  // Arrasta divisor via mouse/touch


  function handleDrag(e) {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let x = 0;
    if (e.type === "touchmove") {
      x = e.touches[0].clientX - rect.left;
    } else {
      x = e.clientX - rect.left;
    }
    let percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setDivider(percent);
  }

  function enableDrag(moveEvent, endEvent) {
    window.addEventListener(moveEvent, handleDrag);
    window.addEventListener(endEvent, () => {
      window.removeEventListener(moveEvent, handleDrag);
    }, { once: true });
  }

  return (
    <section
      id="resultados"
      className="flex flex-col md:flex-row items-center gap-14 px-6 py-16 bg-gradient-to-b from-[#f8f7f3] to-[#eef2e6]"
    >
      {/* Comparador Antes/Depois */}
      <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center">
        <div
          ref={containerRef}
          className="relative w-[340px] h-[330px] rounded-xl overflow-hidden border-2 border-green-300 select-none"
        >
          {/* Imagem "Depois" de fundo */}
          <img
            src={items[0].after}
            alt="depois"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
          />
          {/* Imagem "Antes" cortada dinamicamente */}
          <div
            className="absolute inset-y-0 left-0 transition-all duration-100"
            style={{
              width: `${divider}%`,
              overflow: "hidden",
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              borderTopRightRadius: divider > 99 ? 16 : 0,
              borderBottomRightRadius: divider > 99 ? 16 : 0,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <img
              src={items[0].before}
              alt="antes"
              draggable={false}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Linha divisória + handle */}
          <div
            ref={dragRef}
            className="absolute top-0 bottom-0 flex flex-col items-center"
            style={{
              left: `calc(${divider}% - 18px)`,
              width: "36px",
              cursor: "ew-resize",
              zIndex: 10,
              userSelect: "none",
            }}
            onMouseDown={() => enableDrag("mousemove", "mouseup")}
            onTouchStart={() => enableDrag("touchmove", "touchend")}
          >
            {/* Linha */}
            <div className="w-2 h-full bg-green-700 opacity-70 rounded"></div>
            {/* Botão arraste */}
            <div className="bg-green-700 mt-[-22px] shadow-lg w-9 h-9 rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-white">
              ⇄
            </div>
          </div>
          {/* Labels */}
          <span className="absolute left-2 top-2 bg-green-600 text-white text-xs px-3 py-1 rounded shadow">Antes</span>
          <span className="absolute right-2 top-2 bg-green-700 text-white text-xs px-3 py-1 rounded shadow">Depois</span>
        </div>
      </div>

      {/* Texto/Descrição */}
      <div className="max-w-xl flex flex-col gap-6">
        <span className="text-green-700 text-base font-bold uppercase tracking-wider">
          RESULTADOS
        </span>
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-3 text-gray-900"
        >
          Nós cuidamos do seu investimento!
        </motion.h3>
        <p className="text-gray-700">
          Por mais que cuidemos dos nossos estofados, chega um momento em que apenas aspirar não é suficiente.<br />
          <span className="font-semibold text-gray-800">
            A limpeza profissional de Sofá em sofá, estofados, tapetes, carpetes e cortinas,
          </span>{" "}
          revitaliza as cores, elimina odores e manchas, e melhora a qualidade do ar dentro da sua casa. Recomendamos a higienização pelo menos uma vez ao ano para garantir um ambiente mais saudável.
        </p>
        <p className="text-gray-700">
          Veja a diferença que a limpeza profissional faz. Diga ADEUS à poeira, ácaros com uma limpeza profissional.
        </p>
        <a
          href="https://api.whatsapp.com/send?phone=5561981582388&text=Olá! Quero fazer um orçamento."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-green-700 text-white font-semibold px-7 py-3 shadow-lg hover:bg-green-800 transition"
        >
          Solicitar orçamento
        </a>
      </div>
    </section>
  );
}
