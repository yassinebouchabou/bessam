"use client";

import { useMemo } from 'react';
import { usePixelCart } from '@/lib/store';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, LayoutGrid, Tag } from 'lucide-react';

export default function CategoriesPage() {
  const { products } = usePixelCart();

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      // Simple heuristic to pick an image for the category
      image: products.find(p => p.category === name)?.images[0] || 'https://picsum.photos/seed/cat/600/400'
    }));
  }, [products]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black font-headline mb-2">Nos Catégories</h1>
        <p className="text-muted-foreground">Explorez notre catalogue par domaine d'activité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <Link key={cat.name} href={`/shop?category=${encodeURIComponent(cat.name)}`}>
              <Card className="group relative h-64 overflow-hidden rounded-3xl border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="absolute inset-0 z-0">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                
                <CardContent className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Tag className="h-4 w-4 text-accent" />
                        <span className="text-xs font-bold uppercase tracking-widest text-accent/90">
                          {cat.count} {cat.count > 1 ? 'Produits' : 'Produit'}
                        </span>
                      </div>
                      <h2 className="text-3xl font-black">{cat.name}</h2>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <ChevronRight className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed">
            <LayoutGrid className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground">Aucune catégorie disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
