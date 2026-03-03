'use client'

import { SessionProvider } from 'next-auth/react'
import React, { Children } from 'react'

function AuthProvider({children}:{children: React.ReactNode}) {
  return (
    <SessionProvider>
       {children}
    </SessionProvider>
  )
}

export default AuthProvider
