import { createPublicClient, createWalletClient, http, Abi, Hex, erc20Abi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrum } from 'viem/chains';

const arbitrumPrivateKey = process.env.ARBITRUM_PK as Hex;
export const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http()
});

export function getWalletClient(privateKey: string) {
    console.log("privateKey", privateKey);
    console.log("process.env.ARBITRUM_PK", arbitrumPrivateKey);
  const account = privateKeyToAccount(arbitrumPrivateKey);
  return {
    walletClient: createWalletClient({
      chain: arbitrum,
      account,
      transport: http()
    }),
    account
  };
}

export const rechargeAbi: Abi = [
    {
      inputs: [
        { internalType: "address", name: "tokenAddress", type: "address" },
        { internalType: "uint256", name: "amountPaid", type: "uint256" },
        { internalType: "string", name: "rechargeId", type: "string" },
        { internalType: "string", name: "productCode", type: "string" },
        { internalType: "string", name: "merchantSlug", type: "string" },
      ],
      name: "newRecharge",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];

export const contractAddress = "0x9136bA6934d2857f1D7777C6bAB2f069Ac3d0Cb0";
export const usdcArbitrumAddress = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
export const mxnbArbitrumAddress = "0xF197FFC28c23E0309B5559e7a166f2c6164C80aA";

// Función para verificar el allowance actual
export async function checkAllowance({
  tokenAddress,
  owner,
  spender
}: {
  tokenAddress: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`
}) {
  const allowance = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner, spender]
  });
  return allowance as bigint;
}

// Función para verificar el balance
export async function checkBalance({
  tokenAddress,
  account
}: {
  tokenAddress: `0x${string}`,
  account: `0x${string}`
}) {
  const balance = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account]
  });
  return balance as bigint;
}

// Función para hacer approve
export async function approveToken({
  privateKey,
  tokenAddress,
  spender,
  amount
}: {
  privateKey: string,
  tokenAddress: `0x${string}`,
  spender: `0x${string}`,
  amount: bigint
}) {
  const { walletClient, account } = getWalletClient(privateKey);
  const txHash = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spender, amount],
    account
  });
  return txHash;
}

// Función completa que maneja approve + newRecharge
export async function sendRechargeTx({
  privateKey,
  contractAddress,
  abi,
  tokenAddress,
  amountPaid,
  rechargeId,
  productCode,
  merchantSlug
}: {
  privateKey: string,
  contractAddress: `0x${string}`,
  abi: Abi,
  tokenAddress: `0x${string}`,
  amountPaid: bigint,
  rechargeId: string,
  productCode: string,
  merchantSlug: string
}) {
  const { walletClient, account } = getWalletClient(privateKey);
  
  // 1. Verificar balance
  const balance = await checkBalance({
    tokenAddress,
    account: account.address
  });
  
  if (balance < amountPaid) {
    throw new Error(`Balance insuficiente. Tienes ${balance} pero necesitas ${amountPaid}`);
  }
  
  // 2. Verificar allowance actual
  const currentAllowance = await checkAllowance({
    tokenAddress,
    owner: account.address,
    spender: contractAddress
  });
  
  // 3. Si el allowance no es suficiente, hacer approve
  if (currentAllowance < amountPaid) {
    console.log("Haciendo approve...");
    const approveTxHash = await approveToken({
      privateKey,
      tokenAddress,
      spender: contractAddress,
      amount: amountPaid
    });
    console.log("Approve tx hash:", approveTxHash);
    
    // Esperar a que se confirme el approve (opcional, pero recomendado)
    await publicClient.waitForTransactionReceipt({ hash: approveTxHash });
  }
  
  // 4. Ejecutar newRecharge
  console.log("Ejecutando newRecharge...", account);
  const txHash = await walletClient.writeContract({
    address: contractAddress,
    abi,
    functionName: 'newRecharge',
    args: [
      tokenAddress,
      amountPaid,
      rechargeId,
      productCode,
      merchantSlug
    ],
    account
  });
  
  return txHash;
} 