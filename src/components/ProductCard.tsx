
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { usePixelCart } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = usePixelCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const displayImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : 'https://picsum.photos/seed/placeholder/600/400';

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-1 font-headline text-lg font-semibold group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-2xl font-bold text-primary">{product.price.toLocaleString()} DA</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full gap-2" variant="secondary">
          <ShoppingCart className="h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
}
