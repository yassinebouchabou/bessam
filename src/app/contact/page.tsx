"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message envoyé !",
        description: "Merci pour votre message. Nous vous répondrons dès que possible.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "+213 550 00 00 00",
      desc: "Appelez-nous du Samedi au Jeudi",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: Mail,
      title: "Email",
      value: "contact@bricopro.dz",
      desc: "Nous répondons sous 24h",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      icon: MapPin,
      title: "Localisation",
      value: "Alger, Algérie",
      desc: "Siège social & Showroom",
      color: "text-orange-500",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black font-headline mb-4">Contactez-Nous</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Une question sur un produit ou une commande ? Notre équipe d'experts BRICO PRO DZ est à votre disposition pour vous conseiller.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          {contactInfo.map((info, i) => (
            <div key={i} className="flex gap-6 p-6 rounded-3xl bg-card border shadow-sm group hover:shadow-md transition-shadow">
              <div className={`h-14 w-14 rounded-2xl ${info.bg} flex items-center justify-center ${info.color} shrink-0`}>
                <info.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                <p className="font-black text-primary mb-1">{info.value}</p>
                <p className="text-xs text-muted-foreground">{info.desc}</p>
              </div>
            </div>
          ))}

          <Card className="rounded-3xl border-primary/10 bg-primary/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="font-bold">Horaires d'ouverture</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Samedi - Mercredi</span>
                  <span className="font-bold">08:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jeudi</span>
                  <span className="font-bold">08:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendredi</span>
                  <span className="text-destructive font-bold">Fermé</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
            <div className="bg-primary p-10 text-white">
              <h2 className="text-3xl font-black mb-2 flex items-center gap-4">
                <MessageCircle className="h-8 w-8 text-accent" />
                Envoyez-nous un message
              </h2>
              <p className="opacity-80">Remplissez le formulaire ci-dessous et nous vous contacterons rapidement.</p>
            </div>
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom Complet</Label>
                    <Input id="name" placeholder="Votre nom" className="h-12 rounded-xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" className="h-12 rounded-xl" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input id="subject" placeholder="De quoi s'agit-il ?" className="h-12 rounded-xl" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Dites-nous tout..." rows={6} className="rounded-2xl" required />
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-bold gap-3 rounded-2xl shadow-xl" disabled={loading}>
                  {loading ? "Envoi en cours..." : (
                    <>
                      Envoyer le message
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
