
'use client'

import { ChipiProvider } from '@chipi-pay/chipi-sdk'

const apiPublicKey = process.env.NEXT_PUBLIC_CHIPI_API_KEY!;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChipiProvider
      config={{ apiPublicKey }}
    >
      {children}
    </ChipiProvider>
  )
}