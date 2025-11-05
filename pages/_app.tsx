import { SpeedInsights } from "@vercel/speed-insights/next";

import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NotificationProvider } from '../contexts/NotificationContext';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <SpeedInsights /> <Component {...pageProps} />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
