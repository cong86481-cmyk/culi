import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { ToastProvider } from '@/components/ui/toast'
import { WelcomeNotificationLoader } from '@/components/ui/welcome-notification'

export const metadata: Metadata = {
  title: 'CFL Marketplace - CrossFire Legends Vietnam',
  description: 'Nền tảng mua bán tài khoản CrossFire Legends uy tín số 1 Việt Nam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#0A0A0F" />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { 
            background-color: #0A0A0F !important; 
            margin: 0; 
            padding: 0;
            overflow-x: hidden;
          }
          html { background-color: #0A0A0F !important; }
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            document.documentElement.classList.add('dark');
            document.documentElement.style.backgroundColor = '#0A0A0F';
            document.documentElement.style.colorScheme = 'dark';
          })();
        `}} />
      </head>
      <body>
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
          <WelcomeNotificationLoader />
        </Providers>
      </body>
    </html>
  )
}
