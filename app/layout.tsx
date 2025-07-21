import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'GitForje',
  description: 'Formation gratuite en marketing digital et entrepreneuriat',
  icons: {
    icon: '/favicon.ico',
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