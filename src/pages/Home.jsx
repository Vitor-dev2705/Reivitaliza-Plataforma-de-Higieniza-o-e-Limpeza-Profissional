import React from 'react'
import Header           from '../components/HeaderMobile'
import Hero             from '../components/HeroFinal'
import Services         from '../components/ServicesFinal'
import Portfolio        from '../components/Portfolio'
import ExtraBlocks      from '../components/ExtraBlocks'
import VideoImperm      from '../components/VideoImperm'
import Steps            from '../components/Steps'
import Testimonials     from '../components/TestimonialsFinal'
import FAQ              from '../components/FAQ'
import Footer           from '../components/FooterFinal'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import HiddenAdmin      from '../components/HiddenAdmin'

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <main>
        <Services />
        <Portfolio />
        <ExtraBlocks />
        <VideoImperm />
        <Steps />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />

      {/* Botão flutuante WhatsApp */}
      <FloatingWhatsApp />

      {/* Admin oculto: gatilho secreto no footer + atalho Ctrl+Shift+A */}
      <HiddenAdmin />
    </div>
  )
}
