'use client'

import { ToastProvider } from '@/components/ui/toast'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GlobalBackground, GradientOrbs, GeometricShapes, GridOverlay } from '@/components/ui/global-background'
import { FloatingParticles, CosmicDust, EnergyLines, PulseRings } from '@/components/ui/floating-particles'
import { FloatingContactButtons } from '@/components/ui/floating-contact'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {/* Background layers - optimized for performance */}
      <GlobalBackground />
      <GridOverlay />
      <GradientOrbs />
      <FloatingParticles />
      <CosmicDust />
      <PulseRings />
      
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main 
        className="min-h-screen relative z-10"
        style={{ backgroundColor: 'transparent' }}
      >
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating contact buttons */}
      <FloatingContactButtons />
    </ToastProvider>
  )
}
