
"use client";

import { useState, useEffect, useRef } from 'react';
import { usePixelCart } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Palette, Globe, Check, Upload, ImageIcon, X, ShieldAlert, Trash2, ShoppingCart, Type, Layout } from 'lucide-react';
import Image from 'next/image';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { cn } from '@/lib/utils';

const THEME_PRESETS = [
  { name: "Rouge Brico", value: "0 72% 51%" },
  { name: "Brico Dark", value: "0 0% 15%" },
  { name: "Emerald", value: "160 84% 39%" },
  { name: "Blue Professional", value: "210 50% 37%" },
  { name: "Orange Industrial", value: "24 95% 53%" },
];

const ACCENT_PRESETS = [
  { name: "Royal Purple", value: "270 70% 50%" },
  { name: "Electric Blue", value: "210 100% 50%" },
  { name: "Deep Red", value: "0 80% 45%" },
  { name: "Forest Green", value: "140 60% 35%" },
  { name: "Vibrant Orange", value: "24 95% 53%" },
];

const BG_PRESETS = [
  { name: "Pure White", value: "0 0% 100%" },
  { name: "Soft Gray", value: "210 20% 98%" },
  { name: "Midnight", value: "210 40% 8%" },
  { name: "Cream", value: "40 30% 96%" },
];

const BADGE_PRESETS = [
  { name: "Gold", value: "45 100% 50%" },
  { name: "Fire", value: "0 100% 50%" },
  { name: "Lime", value: "80 90% 50%" },
  { name: "Sunset", value: "24 95% 53%" },
];

const SUPER_ADMIN_UID = 'cgeNA9jvuCeC42zZV4EcntT21Jw2';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = usePixelCart();
  const { user: firebaseUser } = useUser();
  const firestore = useFirestore();
  const [formData, setFormData] = useState(settings);
  const [isWiping, setIsWiping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(settings);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "Veuillez choisir une image de moins de 800 Ko.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
        toast({
          title: "Logo chargé",
          description: "Aperçu mis à jour. N'oubliez pas de sauvegarder.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: "Configuration enregistrée",
      description: "Les modifications ont été enregistrées en base de données.",
    });
  };

  const handleReset = () => {
    setFormData(settings);
  };

  const handleWipeAdmins = async () => {
    if (!firestore || !firebaseUser) return;
    
    const confirmWipe = confirm("ATTENTION : Cette action supprimera TOUS les administrateurs de la base de données. Vous perdrez l'accès au panneau d'administration immédiatement. Voulez-vous continuer ?");
    
    if (!confirmWipe) return;

    setIsWiping(true);
    try {
      const rolesRef = collection(firestore, 'roles_admin');
      const snapshot = await getDocs(rolesRef);
      
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      toast({
        title: "Base de données nettoyée",
        description: "Tous les rôles administrateurs ont été supprimés.",
      });
      
      window.location.href = '/';
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de suppression",
        description: error.message || "Impossible de vider la liste des administrateurs.",
      });
    } finally {
      setIsWiping(false);
    }
  };

  const isSuperAdmin = firebaseUser?.uid === SUPER_ADMIN_UID;

  const ColorSwatch = ({ value, label, active, onClick }: { value: string, label: string, active: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all hover:bg-accent",
        active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
      )}
    >
      <div 
        className="h-8 w-8 rounded-full border shadow-inner" 
        style={{ backgroundColor: `hsl(${value})` }}
      />
      <span className="text-[10px] font-medium truncate w-full text-center">{label}</span>
      {active && (
        <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-2 w-2 text-white" />
        </div>
      )}
    </button>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Configuration du Site</h1>
          <p className="text-muted-foreground">Gérez l'identité visuelle et le formulaire de commande.</p>
        </div>
        {hasChanges && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            Annuler les modifications
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Identité de Marque
            </CardTitle>
            <CardDescription>Mettez à jour le nom et le logo de votre entreprise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brandName">Nom de la boutique</Label>
              <Input
                id="brandName"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              />
            </div>
            
            <div className="space-y-4">
              <Label>Logo de la boutique</Label>
              <div className="relative h-24 w-full overflow-hidden rounded-lg border-2 border-dashed bg-muted flex flex-col items-center justify-center p-4">
                {formData.logoUrl ? (
                  <>
                    <Image 
                      src={formData.logoUrl} 
                      alt="Logo Preview" 
                      fill 
                      className="object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-lg"
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 opacity-50" />
                    <p className="text-xs">Aucun logo sélectionné</p>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleLogoUpload}
              />
              
              <Button
                type="button"
                variant="secondary"
                className="w-full gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Importer un logo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Global Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Thème Visuel
            </CardTitle>
            <CardDescription>Choisissez la couleur principale du site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {THEME_PRESETS.map((theme) => (
                <ColorSwatch 
                  key={theme.value}
                  label={theme.name}
                  value={theme.value}
                  active={formData.primaryColor === theme.value}
                  onClick={() => setFormData({ ...formData, primaryColor: theme.value })}
                />
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t">
              <Label>Code Couleur HSL Manuel</Label>
              <Input
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                placeholder="Ex: 210 50% 37%"
              />
            </div>
          </CardContent>
        </Card>

        {/* Checkout Colors */}
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Styles Visuels du Checkout
            </CardTitle>
            <CardDescription>Personnalisez les couleurs du formulaire avec des choix rapides</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-3">
            {/* Accent Color Selection */}
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Couleur d'Accentuation</Label>
              <div className="grid grid-cols-5 gap-2">
                {ACCENT_PRESETS.map((p) => (
                  <ColorSwatch 
                    key={p.value}
                    label={p.name}
                    value={p.value}
                    active={formData.checkoutColor === p.value}
                    onClick={() => setFormData({ ...formData, checkoutColor: p.value })}
                  />
                ))}
              </div>
              <Input
                className="h-8 text-xs"
                value={formData.checkoutColor}
                onChange={(e) => setFormData({ ...formData, checkoutColor: e.target.value })}
                placeholder="HSL manuel"
              />
            </div>

            {/* Background Color Selection */}
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fond du Formulaire</Label>
              <div className="grid grid-cols-4 gap-2">
                {BG_PRESETS.map((p) => (
                  <ColorSwatch 
                    key={p.value}
                    label={p.name}
                    value={p.value}
                    active={formData.checkoutBgColor === p.value}
                    onClick={() => setFormData({ ...formData, checkoutBgColor: p.value })}
                  />
                ))}
              </div>
              <Input
                className="h-8 text-xs"
                value={formData.checkoutBgColor}
                onChange={(e) => setFormData({ ...formData, checkoutBgColor: e.target.value })}
                placeholder="HSL manuel"
              />
            </div>

            {/* Price Badge Color Selection */}
            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Badge Prix</Label>
              <div className="grid grid-cols-4 gap-2">
                {BADGE_PRESETS.map((p) => (
                  <ColorSwatch 
                    key={p.value}
                    label={p.name}
                    value={p.value}
                    active={formData.priceBadgeColor === p.value}
                    onClick={() => setFormData({ ...formData, priceBadgeColor: p.value })}
                  />
                ))}
              </div>
              <Input
                className="h-8 text-xs"
                value={formData.priceBadgeColor}
                onChange={(e) => setFormData({ ...formData, priceBadgeColor: e.target.value })}
                placeholder="HSL manuel"
              />
            </div>
          </CardContent>
        </Card>

        {/* Checkout Content */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              Textes du Formulaire (Arabe)
            </CardTitle>
            <CardDescription>Modifiez tous les titres, boutons et étiquettes du formulaire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Titre du Formulaire</Label>
                <Input dir="rtl" value={formData.checkoutTitleAr} onChange={(e) => setFormData({ ...formData, checkoutTitleAr: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Texte du Bouton d'Achat</Label>
                <Input dir="rtl" value={formData.checkoutButtonTextAr} onChange={(e) => setFormData({ ...formData, checkoutButtonTextAr: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Message de Succès</Label>
                <Input dir="rtl" value={formData.checkoutSuccessMsgAr} onChange={(e) => setFormData({ ...formData, checkoutSuccessMsgAr: e.target.value })} />
              </div>
            </div>

            <div className="border-t pt-6">
              <CardTitle className="text-sm font-bold mb-4 flex items-center gap-2">
                <Layout className="h-4 w-4" /> Étiquettes des Champs (Labels)
              </CardTitle>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="space-y-2">
                  <Label className="text-xs">Label: Nom Complet</Label>
                  <Input dir="rtl" value={formData.nameLabelAr} onChange={(e) => setFormData({ ...formData, nameLabelAr: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Label: Téléphone</Label>
                  <Input dir="rtl" value={formData.phoneLabelAr} onChange={(e) => setFormData({ ...formData, phoneLabelAr: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Label: الولاية</Label>
                  <Input dir="rtl" value={formData.stateLabelAr} onChange={(e) => setFormData({ ...formData, stateLabelAr: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Label: البلدية</Label>
                  <Input dir="rtl" value={formData.communeLabelAr} onChange={(e) => setFormData({ ...formData, communeLabelAr: e.target.value })} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Super Admin Actions */}
      {isSuperAdmin && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              Gestion des Accès (Super Admin)
            </CardTitle>
            <CardDescription>Actions irréversibles sur les privilèges de la base de données.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-background">
              <div>
                <p className="font-bold text-sm">Réinitialiser la liste des administrateurs</p>
                <p className="text-xs text-muted-foreground italic">Supprime toutes les entrées sauf le Super Admin.</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleWipeAdmins}
                disabled={isWiping}
                className="gap-2"
              >
                {isWiping ? "En cours..." : <Trash2 className="h-4 w-4" />}
                Tout Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          size="lg" 
          onClick={handleSave} 
          className="px-12 h-14 text-lg font-bold shadow-2xl scale-110" 
          disabled={!hasChanges}
        >
          {hasChanges ? "Enregistrer tout" : "Aucun changement"}
        </Button>
      </div>
    </div>
  );
}
