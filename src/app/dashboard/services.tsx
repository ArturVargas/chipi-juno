"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { sendRechargeTx, rechargeAbi, contractAddress, mxnbArbitrumAddress } from "@/lib/arbitrumTx";

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

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  isLoading: boolean;
}

function PinModal({ isOpen, onClose, onConfirm, isLoading }: PinModalProps) {
  const [pin, setPin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim()) {
      onConfirm(pin);
      setPin("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar compra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">PIN de tu wallet</label>
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Ingresa tu PIN"
              required
              disabled={isLoading}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !pin.trim()}>
              {isLoading ? "Procesando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
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
        const categoriesQuery = CATEGORIAS.map(cat => `categories=${cat}`).join('&');
        const response = await fetch(`https://api.chipipay.com/v1/skus?${categoriesQuery}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHIPI_SK_KEY}`,
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
  const { getToken } = useAuth();
  // const { isLoading: isContractLoading, callAnyContractAsync } = useCallAnyContract();
  const { user, isSignedIn } = useUser();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();
  const [showPinModal, setShowPinModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm | null>(null);

  const handleFormSubmit = (data: CheckoutForm) => {
    setFormData(data);
    setShowPinModal(true);
  };

  const handlePinConfirm = async () => {
    if (!formData || !isSignedIn || !user) {
      alert("Error: Datos de formulario o usuario no válidos");
      return;
    }

    setIsProcessing(true);
    try {
      const token = await getToken({ template: "mxnb-demo" });
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const wallet = user?.publicMetadata?.publicKey && user?.publicMetadata?.encryptedPrivateKey
        ? {
            publicKey: user.publicMetadata.publicKey as string,
            encryptedPrivateKey: user.publicMetadata.encryptedPrivateKey as string,
          }
        : null;
      
      if (!wallet) {
        throw new Error("Wallet no encontrada");
      }
      
      console.log("Sending recharge tx", servicio);
      
      // Convertir el monto MXN a tokens MXNB (asumiendo 1:1 por ahora)
      const mxnAmount = servicio.fixedAmount || parseFloat(formData.amount);
      const mxnbAmount = BigInt(Math.floor(mxnAmount * 10**6)); // MXNB tiene 6 decimales
      
      const transactionHash = await sendRechargeTx({
        privateKey: wallet.encryptedPrivateKey, // TODO: now this is not using because the sdk only works with starknet chain
        contractAddress: contractAddress,
        abi: rechargeAbi,
        tokenAddress: mxnbArbitrumAddress,
        amountPaid: mxnbAmount,
        rechargeId: servicio.id,
        productCode: servicio.name,
        merchantSlug: "chipipay"
      });
      
      // Enviar la transacción a la API de ChipiPay
      const response = await fetch("https://api.chipipay.com/v1/sku-transactions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CHIPI_SK_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          walletAddress: process.env.NEXT_PUBLIC_ARBITRUM_PUBLIC_KEY,
          skuId: servicio.id,
          chain: "ARBITRUM",
          chainToken: "MXNB",
          mxnAmount: servicio.fixedAmount || parseFloat(formData.amount),
          reference: formData.reference,
          transactionHash: transactionHash
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error("Error al procesar la transacción");
      }

      const transaction = await response.json();
      console.log("Transacción exitosa:", transaction);
      
      alert(`¡Compra exitosa! ID de transacción: ${transaction.id || 'N/A'}`);
      
      // Cerrar modales
      setShowPinModal(false);
      setFormData(null);
      
    } catch (error: unknown) {
      console.error("Error en la compra:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Error desconocido en la compra");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
          <Button type="submit" disabled={isProcessing}>
            Continuar
          </Button>
        </DialogFooter>
      </form>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onConfirm={handlePinConfirm}
        isLoading={isProcessing}
      />
    </>
  );
} 