import { Geist } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'UniApply — Find & Apply to Universities',
  description: 'Discover universities and apply to programs online.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AuthProvider>
          <Toaster position="top-right" />
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}