"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

const CATEGORIAS = ["GENERAL", "LUZ", "STREAMING"];

interface Sku {
  id: string;
  name: string;
  description: string;
  category: string;
  referenceLabel?: string;
  referenceRegexValidation?: string;
  amountLabel?: string;
  amountRegexValidation?: string;
  fixedAmount?: number;
}

interface CheckoutForm {
  reference: string;
  amount: string;
}

export default function ServicesPage() {
  const { getToken } = useAuth();
  const [servicios, setServicios] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServicios() {
      setLoading(true);
      setError(null);
      try {
        // const token = await getToken({ template: "mxnb-demo" });
        const categoriesQuery = CATEGORIAS.map(cat => `categories=${cat}`).join('&');
        const response = await fetch(`https://api.chipipay.com/v1/skus?${categoriesQuery}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer sk_dev_f98bbdfbc84d6f5dde7c78173e0c7dca31e7a20bc6e5c5aaaa12f47222993f38`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener servicios");
        const data = await response.json();
        console.log('API Response:', data); // Debug
        
        setServicios(data.skus);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchServicios();
  }, [getToken]);

  // Agrupar por categoría
  const serviciosPorCategoria: Record<string, Sku[]> = {};
  if (Array.isArray(servicios)) {
    servicios.forEach((servicio) => {
      if (!serviciosPorCategoria[servicio.category]) {
        serviciosPorCategoria[servicio.category] = [];
      }
      serviciosPorCategoria[servicio.category].push(servicio);
    });
  }

  if (loading) return <div className="p-8">Cargando servicios...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (servicios.length === 0) return <div className="p-8">No hay servicios disponibles.</div>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Servicios disponibles</h1>
      <Tabs defaultValue={CATEGORIAS[0]} className="w-full">
        <TabsList className="mb-6">
          {CATEGORIAS.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        {CATEGORIAS.map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(serviciosPorCategoria[cat] || []).map((servicio) => (
                <Dialog key={servicio.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">{servicio.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-3 text-sm text-muted-foreground line-clamp-3">{servicio.description}</p>
                        {servicio.fixedAmount && (
                          <p className="text-lg font-semibold text-primary">
                            ${servicio.fixedAmount.toLocaleString('es-MX')} MXN
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Categoría: {servicio.category}</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Comprar {servicio.name}</DialogTitle>
                    </DialogHeader>
                    <CheckoutDialogForm servicio={servicio} />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function CheckoutDialogForm({ servicio }: { servicio: Sku }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();
  const onSubmit = (data: CheckoutForm) => {
    // Aquí irá la lógica de compra
    alert(JSON.stringify(data));
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {servicio.referenceLabel && (
        <div>
          <label className="block text-sm font-medium mb-1">{servicio.referenceLabel}</label>
          <input
            {...register("reference", {
              required: true,
              pattern: servicio.referenceRegexValidation ? new RegExp(servicio.referenceRegexValidation) : undefined,
            })}
            className="w-full border rounded px-3 py-2"
            placeholder={servicio.referenceLabel}
          />
          {errors.reference && <span className="text-xs text-red-500">Referencia inválida</span>}
        </div>
      )}
      {servicio.fixedAmount ? (
        <div>
          <label className="block text-sm font-medium mb-1">Monto</label>
          <input
            value={servicio.fixedAmount}
            disabled
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>
      ) : servicio.amountLabel ? (
        <div>
          <label className="block text-sm font-medium mb-1">{servicio.amountLabel}</label>
          <input
            {...register("amount", {
              required: true,
              pattern: servicio.amountRegexValidation ? new RegExp(servicio.amountRegexValidation) : undefined,
            })}
            className="w-full border rounded px-3 py-2"
            placeholder={servicio.amountLabel}
          />
          {errors.amount && <span className="text-xs text-red-500">Monto inválido</span>}
        </div>
      ) : null}
      <DialogFooter>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Confirmar compra</button>
      </DialogFooter>
    </form>
  );
} 