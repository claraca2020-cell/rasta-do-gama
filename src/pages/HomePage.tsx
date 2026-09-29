import { AboutRasta, HeroSlideshow, HowWeAct, Partners, SocialArea, StoreSection, SupportSection } from '../components/HomeSections'

// Home institucional (inspiração: institutogalo.com.br). A loja continua, mas como uma seção entre outras.
export function HomePage() {
  return (
    <>
      <HeroSlideshow />
      <AboutRasta />
      <SocialArea />
      <HowWeAct />
      <StoreSection />
      <SupportSection />
      <Partners />
    </>
  )
}
