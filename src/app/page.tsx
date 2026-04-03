"use client";

import { useMemo } from 'react';
import { usePixelCart } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Hammer, ShieldCheck, Truck, Wrench, Mail, Phone, MapPin, LayoutGrid, ChevronRight, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { products, settings, categories } = usePixelCart();

  // Sort products by createdAt descending and take the first 8
  const latestProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [products]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary py-20 lg:py-32 overflow-hidden min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/industrial-hero/1920/1080"
            alt="Brico Pro Industrial Gear"
            fill
            className="object-cover opacity-20"
            priority
            data-ai-hint="industrial tools"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="max-w-3xl">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              L'Outillage Professionnel <br/>
              <span className="text-accent">Au Service de Vos Projets</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-10 leading-relaxed max-w-2xl">
              Découvrez notre sélection rigoureuse d'outils et d'équipements industriels de haute qualité. BRICO PRO DZ accompagne les artisans et les professionnels en Algérie.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-8 h-14 text-lg">
                <a href="#products">Découvrir le Catalogue</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg">
                <Link href="/register">Rejoindre la Communauté</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-muted py-8 border-b animate-in fade-in duration-1000">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide">Livraison Rapide</h3>
                <p className="text-xs text-muted-foreground">Partout en Algérie sous 48-72h</p>
              </div>
            </div>
            <div className="flex items-center gap-4 transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide">Qualité Garantie</h3>
                <p className="text-xs text-muted-foreground">Outils certifiés et robustes</p>
              </div>
            </div>
            <div className="flex items-center gap-4 transition-transform hover:scale-105">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wide">S.A.V Dédié</h3>
                <p className="text-xs text-muted-foreground">Assistance technique personnalisée</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Explorer Section */}
      <section className="container mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-primary pl-6">
          <div>
            <h2 className="font-headline text-3xl font-bold">Explorer par Catégories</h2>
            <p className="text-muted-foreground mt-2">Trouvez l'équipement adapté à votre métier.</p>
          </div>
          <Button asChild variant="ghost" className="text-primary font-bold gap-2">
            <Link href="/categories">
              Voir toutes les catégories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((cat) => (
            <Link key={cat.id} href={`/shop?category=${encodeURIComponent(cat.name)}`}>
              <Card className="group relative h-64 overflow-hidden rounded-3xl border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={cat.image || 'https://picsum.photos/seed/cat/600/400'} 
                    alt={cat.name} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                
                <CardContent className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <h2 className="text-2xl font-black">{cat.name}</h2>
                      <p className="text-xs font-bold uppercase tracking-widest text-accent/90 mt-1">
                        Découvrir la gamme
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed">
              <LayoutGrid className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground">Configurez vos catégories dans le tableau de bord.</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Products Grid */}
      <section id="products" className="container mx-auto px-4 py-16 scroll-mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-primary pl-6">
          <div>
            <h2 className="font-headline text-3xl font-bold">Nos Dernières Nouveautés</h2>
            <p className="text-muted-foreground mt-2">Le meilleur de l'équipement fraîchement arrivé pour votre chantier.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Hammer className="h-4 w-4" />
            <span>{products.length} Articles Disponibles</span>
          </div>
        </div>

        {latestProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-2xl border-2 border-dashed p-20 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Wrench className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">Inventaire en cours de mise à jour</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Nous ajoutons de nouveaux outils chaque jour. Revenez très bientôt pour découvrir nos nouveautés !
            </p>
          </div>
        )}
      </section>

      {/* Footer Info Section */}
      <section className="bg-card py-20 border-y animate-in fade-in duration-1000">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Branding & Logo */}
            <div className="space-y-6">
              <Link href="/" className="inline-block">
                {settings.logoUrl ? (
                  <div className="relative h-12 w-48 overflow-hidden">
                    <Image 
                      src={settings.logoUrl} 
                      alt={settings.brandName} 
                      fill 
                      className="object-contain object-left"
                    />
                  </div>
                ) : (
                  <h2 className="text-2xl font-black text-primary">{settings.brandName}</h2>
                )}
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Votre partenaire de confiance pour l'outillage professionnel et l'équipement industriel en Algérie. Qualité, durabilité et service expert.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-headline">Liens Rapides</h3>
              <nav className="flex flex-col gap-3">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Accueil</Link>
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">Boutique</Link>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">Catégories</Link>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-headline">Contactez-nous</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">+213 550 00 00 00</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">contact@bricopro.dz</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Alger, Algérie</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
