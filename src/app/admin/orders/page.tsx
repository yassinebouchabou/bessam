"use client";

import { useState, useMemo } from 'react';
import { usePixelCart } from '@/lib/store';
import Image from 'next/image';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Clock, DollarSign, Search, Filter, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = usePixelCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const statusOptions: { label: string; value: OrderStatus | 'all' }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Pas encore expédiées', value: 'pending' },
    { label: 'Prêt à expédier', value: 'ready' },
    { label: 'Au bureau', value: 'at_office' },
    { label: 'Dispatch', value: 'dispatch' },
    { label: 'Vers Wilaya', value: 'shipped' },
    { label: 'En livraison', value: 'delivering' },
    { label: 'Livrée', value: 'delivered' },
  ];

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'ready': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Prêt</Badge>;
      case 'at_office': return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Au bureau</Badge>;
      case 'dispatch': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Dispatch</Badge>;
      case 'shipped': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Vers Wilaya</Badge>;
      case 'delivering': return <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">En livraison</Badge>;
      case 'delivered': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Livrée</Badge>;
      case 'cancelled': return <Badge variant="destructive">Annulée</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gestion des Commandes</h1>
        <p className="text-muted-foreground">Suivez et traitez les achats de vos clients en temps réel.</p>
      </div>

      {/* Tracking Bar */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <ScrollArea className="w-full">
          <div className="flex items-center min-w-max p-1">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={cn(
                  "relative flex items-center gap-3 px-6 py-4 transition-all duration-200 group",
                  statusFilter === opt.value 
                    ? "text-primary font-bold" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="text-sm whitespace-nowrap">{opt.label}</span>
                <span className={cn(
                  "flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-[11px] font-black transition-colors",
                  statusFilter === opt.value 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted group-hover:bg-muted-foreground/10"
                )}>
                  {statusCounts[opt.value] || 0}
                </span>
                {statusFilter === opt.value && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                )}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commandes Totales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">À Traiter</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recettes Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} DA</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between bg-card p-4 rounded-lg border">
        <div className="flex flex-1 items-center gap-4 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Chercher par Client, Téléphone ou ID..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Produit</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Traitement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground italic">
                  Aucune commande trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="relative h-10 w-10 overflow-hidden rounded bg-muted border">
                      {order.productImage ? (
                        <Image 
                          src={order.productImage} 
                          alt={order.productName} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">ID: {order.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {order.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold">{order.state}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-2 w-2" />
                      {order.commune}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-xs" title={order.productName}>
                      {order.productName} (x{order.quantity})
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-primary whitespace-nowrap">{order.totalAmount.toLocaleString()} DA</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <Select 
                      value={order.status} 
                      onValueChange={(val) => updateOrderStatus(order.id, val as OrderStatus)}
                    >
                      <SelectTrigger className="w-[150px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pas encore expédiée</SelectItem>
                        <SelectItem value="ready">Prêt à expédier</SelectItem>
                        <SelectItem value="at_office">Au bureau</SelectItem>
                        <SelectItem value="dispatch">Dispatch</SelectItem>
                        <SelectItem value="shipped">Vers Wilaya</SelectItem>
                        <SelectItem value="delivering">En livraison</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
