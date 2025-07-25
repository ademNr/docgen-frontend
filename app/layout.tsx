import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'GitForje',
  description: 'Transform your GitHub repositories into stunning documentation that developers love to read',
  icons: {
    icon: '/faviconLogo.ico',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}
      className={typeof window === 'undefined' ? 'server-class' : undefined} >
      <body >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}