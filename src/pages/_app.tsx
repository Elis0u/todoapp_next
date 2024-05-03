import React from 'react'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Layout from '@/components/layout'

import '@/styles/global.css'

const App: React.FC<AppProps> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <React.StrictMode>
            <SessionProvider session={session}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
        </React.StrictMode>
    )
}

export default App