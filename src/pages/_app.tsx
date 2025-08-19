import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { PrivacyNotice } from '@/components/PrivacyNotice'

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
    <Component {...pageProps} />
    <PrivacyNotice />
  </>
  )
}
