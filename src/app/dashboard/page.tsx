"use client"

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { useUser, useAuth } from "@clerk/nextjs";
import { User, Wallet } from "lucide-react";

import { useCreateWallet } from "@chipi-pay/chipi-sdk";
import ServicesPage from "./services";
import { completeOnboarding } from "@/lib/actions";
import { checkBalance, mxnbArbitrumAddress } from "@/lib/arbitrumTx";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  // Obtener el balance de MXNB
  useEffect(() => {
    async function fetchBalance() {
      try {
        const balanceResult = await checkBalance({
          tokenAddress: mxnbArbitrumAddress,
          account: "0x86300E0a857aAB39A601E89b0e7F15e1488d9F0C" as `0x${string}`,
        });
        console.log("balance", balanceResult);
        setBalance(balanceResult);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      } finally {
        setBalanceLoading(false);
      }
    }
    
    fetchBalance();
  }, []);

  const { createWalletAsync } = useCreateWallet();
  const { getToken } = useAuth();
  const [pin, setPin] = useState("");
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleCreateWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsCreatingWallet(true);
    
    try {
      if (!pin) {
          throw new Error("PIN is required");
      }
      const token = await getToken({ template: "mxnb-demo" });
      if (!token) {
          throw new Error("No bearer token found");
        }
        const response = await createWalletAsync({
          encryptKey: pin,
          bearerToken: token,
        });
        console.log('Wallet creation response:', response);

        if (!response.success || !response.wallet) {
          throw new Error('Failed to create wallet');
        }

        // Guardar la wallet en los metadatos de Clerk
        const walletData = {
          publicKey: response.wallet.publicKey,
          encryptedPrivateKey: response.wallet.encryptedPrivateKey,
        };
        
        const metadataResult = await completeOnboarding(walletData);
        if (metadataResult.error) {
          throw new Error(metadataResult.error);
        }
        
        // Recargar la página para mostrar el dashboard completo
        window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al crear la wallet");
      }
    } finally {
      setIsCreatingWallet(false);
    }
  }

  // Validar metadata
  const walletCreated = user?.publicMetadata?.walletCreated as boolean | undefined;

  const hasWallet = !!walletCreated;

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-[40vh]">Cargando...</div>;
  }

  if (!hasWallet) {
    // Flujo de onboarding
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>¡Bienvenido!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Para continuar, necesitas crear tu wallet de Chipi.</p>
            <form onSubmit={handleCreateWallet} className="flex flex-col gap-2">
              <Input type="password" placeholder="PIN" name="pin" value={pin} onChange={(e) => setPin(e.target.value)} />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button 
                type="submit" 
                disabled={isCreatingWallet}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {isCreatingWallet ? "Creando wallet..." : "Crear wallet"}
              </button>
            </form>
            {/* Aquí puedes poner un botón o componente para iniciar el onboarding */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 px-4">
      {/* Cards de información del usuario y balance - parte superior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <User className="text-primary" />
            <CardTitle>Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-medium">
              {user?.fullName || user?.username || user?.emailAddresses?.[0]?.emailAddress || "Sin nombre"}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <Wallet className="text-primary" />
            <CardTitle>Balance MXNB</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-medium">
              {balanceLoading ? (
                "Cargando..."
              ) : balance !== null ? (
                `${Number(balance) / 10**6} MXNB`
              ) : (
                "Error al cargar"
              )}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Componente de servicios - parte inferior */}
      <ServicesPage />
    </div>
  );
}
