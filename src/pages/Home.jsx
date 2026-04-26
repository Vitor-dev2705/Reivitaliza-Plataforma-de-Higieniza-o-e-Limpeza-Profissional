import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header        from '../components/HeaderMobile'
import Hero          from '../components/HeroFinal'
import Services      from '../components/ServicesFinal'
import ExtraBlocks   from '../components/ExtraBlocks'
import VideoImperm   from '../components/VideoImperm'
import Steps         from '../components/Steps'
import Testimonials  from '../components/TestimonialsFinal'
import FAQ           from '../components/FAQ'
import Footer        from '../components/FooterFinal'
import AdminPanel    from '../components/AdminPanel'

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false)

  return (
    <div>
      <Header onOpenAdmin={() => setAdminOpen(true)} />
      <Hero />
      <main className="container-max mx-auto px-4">
        <Services />
        <ExtraBlocks />
        <VideoImperm />
        <Steps />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />

      {/* Painel Admin (slide-in lateral) */}
      <AnimatePresence>
        {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
