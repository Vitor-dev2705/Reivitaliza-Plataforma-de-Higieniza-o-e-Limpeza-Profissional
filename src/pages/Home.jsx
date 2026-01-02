import React from 'react'
import Header from '../components/HeaderMobile'
import Hero from '../components/HeroFinal'
import Services from '../components/ServicesFinal'
import Steps from '../components/Steps'
import Results from '../components/BeforeAfter'
import Testimonials from '../components/TestimonialsFinal'
import FAQ from '../components/FAQ'
import Footer from '../components/FooterFinal'

export default function Home(){
  return (
    <div>
      <Header />
      <Hero />
      <main className="container-max mx-auto px-4">
        <Services />
        <Steps />
        <Results />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
