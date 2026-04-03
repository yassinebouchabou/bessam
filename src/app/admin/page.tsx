
"use client";

import { usePixelCart } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis
} from 'recharts';
import { useMemo } from 'react';

export default function AdminDashboard() {
  const { products, orders } = usePixelCart();

  // Calculate real-time stats with strict memoization
  const stats = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const active = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
    const unique = new Set(orders.map(o => o.phone)).size; // More reliable than name

    return [
      { title: "Produits Totaux", value: products.length, icon: Package, color: "text-blue-500", desc: "Inventaire actif" },
      { title: "Commandes Actives", value: active, icon: ShoppingBag, color: "text-emerald-500", desc: "En cours de traitement" },
      { title: "Clients Uniques", value: unique || 0, icon: Users, color: "text-orange-500", desc: "Basé sur les n° de téléphone" },
      { title: "Chiffre d'Affaires", value: `${revenue.toLocaleString()} DA`, icon: DollarSign, color: "text-purple-500", desc: "Revenu total cumulé" },
    ];
  }, [products.length, orders]);

  // Calculate Dynamic Chart Data (Last 7 Days Revenue)
  const chartData = useMemo(() => {
    const dates = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return dates.map(date => {
      const dayOrders = orders.filter(o => o.createdAt.split('T')[0] === date);
      const revenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        name: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
        revenue: revenue
      };
    });
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Tableau de Bord</h1>
          <p className="text-muted-foreground">Analyse en temps réel de la performance de votre boutique.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendance des Ventes (7 derniers jours)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `${value} DA`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value.toLocaleString()} DA`, 'Revenu']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: 'white', strokeWidth: 2, stroke: 'hsl(var(--primary))' }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      Commande de {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.totalAmount.toLocaleString()} DA • {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-[10px] font-bold uppercase text-primary/60">
                    {order.status}
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground italic">
                    Aucune commande enregistrée pour le moment.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
