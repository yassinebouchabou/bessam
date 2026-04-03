
"use client";

import { usePixelCart } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const { cart, removeFromCart } = usePixelCart();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <div className="rounded-full bg-muted p-6">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold">Your cart is empty</h2>
      <p className="text-muted-foreground">Add some items to get started!</p>
      <Button asChild className="mt-4">
        <Link href="/">Browse Products</Link>
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-headline text-3xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="flex items-center p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="ml-4 flex-grow">
                  <Link href={`/product/${item.id}`} className="font-semibold hover:text-primary">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="mt-1 font-bold">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="ml-4 flex items-center space-x-4">
                  <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-bold">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="mt-8 w-full gap-2" size="lg">
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Taxes calculated at checkout
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
