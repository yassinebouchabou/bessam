import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { PixelCartProvider } from '@/lib/store';
import { FirebaseClientProvider } from '@/firebase';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BRICO PRO DZ | Outillage & Équipement',
  description: 'Votre partenaire pour l\'outillage professionnel en Algérie.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <PixelCartProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="border-t bg-card py-12">
              <div className="container mx-auto px-4 text-center text-muted-foreground">
                <p className="text-lg font-bold text-primary mb-2">BRICO PRO DZ</p>
                <p className="text-sm">&copy; {new Date().getFullYear()} BRICO PRO DZ. Tous droits réservés.</p>
              </div>
            </footer>
            <Toaster />
          </PixelCartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
