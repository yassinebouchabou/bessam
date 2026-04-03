
"use client";

import { usePixelCart } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Settings,
  ShoppingBag,
  Users,
  ChevronRight,
  Menu,
  ShieldCheck,
  User,
  Truck,
  Globe,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, settings } = usePixelCart();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || !user.isAdmin) return null;

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Catalogue Produits', href: '/admin/products', icon: Package },
    { label: 'Gérer Catégories', href: '/admin/categories', icon: LayoutGrid },
    { label: 'Ajouter Produit', href: '/admin/products/new', icon: PlusCircle },
    { label: 'Gestion Commandes', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Tarifs Livraison', href: '/admin/delivery', icon: Truck },
    { label: 'Base Clients', href: '/admin/customers', icon: Users },
    { label: 'Configuration Site', href: '/admin/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-8">
      <div className="px-6 mb-8">
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
              <User className="h-3 w-3 text-primary" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Connecté en tant que</span>
          </div>
          <h2 className="text-2xl font-black text-foreground truncate leading-tight" title={user?.name}>
            {user?.name || "Admin"}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl w-fit">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              Administration
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start gap-3 h-10 border-primary/20 text-primary hover:bg-primary/5 rounded-xl group transition-all">
            <Globe className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">Voir le Site Public</span>
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button 
                variant={isActive ? "secondary" : "ghost"} 
                className={cn(
                  "w-full justify-start gap-3 h-12 transition-all duration-300 rounded-xl px-4",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold scale-[1.02] hover:bg-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                <span className="text-sm">{item.label}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4 animate-pulse" />}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto pt-6 border-t border-border/50">
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 backdrop-blur-sm">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Boutique Active</p>
          <p className="text-xs font-black text-foreground truncate">{settings.brandName}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#f8fafc]">
      <aside className="w-72 border-r bg-card hidden lg:block sticky top-16 h-[calc(100vh-4rem)] shadow-sm">
        <SidebarContent />
      </aside>

      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="h-16 w-16 rounded-full shadow-2xl scale-110 bg-primary hover:bg-primary/90">
              <Menu className="h-7 w-7" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu d'Administration</SheetTitle>
              <SheetDescription>Navigation vers les différentes sections de gestion.</SheetDescription>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 overflow-auto relative">
        <div className="mx-auto max-w-7xl p-6 md:p-10 animate-in fade-in duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
