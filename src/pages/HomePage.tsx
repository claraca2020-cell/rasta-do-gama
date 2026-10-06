import { AboutRasta, Friends, HeroSlideshow, HowWeAct, NextSteps, SocialArea, StoreSection, SupportSection } from '../components/HomeSections'

// Home institucional (inspiração: institutogalo.com.br). A loja continua, mas como uma seção entre outras.
// 06/10/2026: a faixa de patrocinadores saiu do final da página (pedido da Rasta) e deu lugar a "Amigos e colaboradores".
export function HomePage() {
  return (
    <>
      <HeroSlideshow />
      <AboutRasta />
      <SocialArea />
      <NextSteps />
      <HowWeAct />
      <StoreSection />
      <SupportSection />
      <Friends />
    </>
  )
}
