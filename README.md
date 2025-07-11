# BipsiPay Services - Dashboard de Pagos

## Live Demo

[App](https://chipi-juno.vercel.app/)

Una aplicación web moderna para la compra de servicios de pago utilizando blockchain (Arbitrum) y tokens MXNB. Los usuarios pueden crear wallets, ver su balance y realizar compras de servicios como CFE, streaming, y otros.

## 🚀 Características

- **Autenticación segura** con Clerk
- **Creación de wallets** con PIN de seguridad
- **Dashboard interactivo** con balance en tiempo real
- **Compra de servicios** agrupados por categorías
- **Transacciones blockchain** en Arbitrum usando MXNB
- **UI moderna** con shadcn/ui y Tailwind CSS
- **Validación de formularios** con react-hook-form

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Autenticación**: Clerk
- **Blockchain**: Viem, Arbitrum
- **UI**: shadcn/ui, Tailwind CSS
- **Formularios**: react-hook-form
- **Wallet SDK**: ChipiPay SDK

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Clerk (para autenticación)
- Cuenta en ChipiPay (para API key)
- Wallet de Arbitrum con MXNB para testing

## 🔧 Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd chipi-svc
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ChipiPay API
NEXT_PUBLIC_CHIPI_SK_KEY=sk_dev_...

# ChipiPay SDK
NEXT_PUBLIC_CHIPI_API_KEY=pk_...

# Arbitrum Private Key (SOLO PARA TESTING - NUNCA EN PRODUCCIÓN)
ARBITRUM_PK=0x...
```

### 4. Configurar Clerk

1. Ve a [Clerk Dashboard](https://dashboard.clerk.com/)
2. Crea una nueva aplicación
3. Configura los dominios permitidos
4. Copia las claves públicas y secretas
5. Crea un template JWT llamado "mxnb-demo"

### 5. Configurar ChipiPay

1. Ve a [ChipiPay Dashboard](https://dashboard.chipipay.com/)
2. Obtén tu API key
3. Configura los endpoints necesarios

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔐 Variables de Entorno

### Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clave pública de Clerk | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clave secreta de Clerk | `sk_test_...` |
| `NEXT_PUBLIC_CHIPI_SK_KEY` | API key de ChipiPay | `sk_dev_...` |
| `NEXT_PUBLIC_CHIPI_API_KEY` | API key del SDK de ChipiPay | `pk_...` |

### Opcionales (para testing)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `ARBITRUM_PK` | Private key de Arbitrum (SOLO TESTING) | `0x...` |

⚠️ **IMPORTANTE**: Nunca expongas private keys en el frontend. En producción, las transacciones deben hacerse desde el backend.

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          # Dashboard principal
│   │   └── services.tsx      # Componente de servicios
│   ├── sign-in/
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   └── ui/                   # Componentes shadcn/ui
├── lib/
│   ├── actions.ts            # Server actions
│   ├── arbitrumTx.ts         # Lógica de transacciones
│   └── utils.ts
└── middleware.ts
```

## 🔄 Flujo de la Aplicación

### 1. Onboarding del Usuario
1. Usuario se registra/inicia sesión con Clerk
2. Crea una wallet con PIN de seguridad
3. Los datos de la wallet se guardan en Clerk metadata

### 2. Dashboard Principal
1. Muestra información del usuario
2. Muestra balance MXNB en tiempo real
3. Lista servicios disponibles por categorías

### 3. Compra de Servicios
1. Usuario selecciona un servicio (ej: CFE)
2. Llena formulario con referencia y monto
3. Confirma con PIN
4. Se ejecuta transacción en Arbitrum:
   - Verifica balance
   - Hace approve (si es necesario)
   - Ejecuta `newRecharge`
5. Se envía txHash a API de ChipiPay
6. Se muestra confirmación

## 📄 Contratos Desplegados

### Arbitrum Mainnet

| Contrato | Dirección | Descripción |
|----------|-----------|-------------|
| Recharge Contract | `0x9136bA6934d2857f1D7777C6bAB2f069Ac3d0Cb0` | Contrato principal para recargas |
| MXNB Token | `0xF197FFC28c23E0309B5559e7a166f2c6164C80aA` | Token MXNB en Arbitrum |
| USDC | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` | USDC en Arbitrum |

### Funciones del Contrato

```solidity
function newRecharge(
    address tokenAddress,
    uint256 amountPaid,
    string memory rechargeId,
    string memory productCode,
    string memory merchantSlug
) external payable nonReentrant
```

## 🧪 Testing

### Prerrequisitos para Testing
- Wallet de Arbitrum con MXNB
- Private key válida (solo para testing)
- Servicios configurados en ChipiPay

### Pasos para Testing
1. Configura todas las variables de entorno
2. Ejecuta `npm run dev`
3. Registra un usuario en Clerk
4. Crea una wallet con PIN
5. Prueba la compra de un servicio

## 🚨 Consideraciones de Seguridad

### ⚠️ IMPORTANTE
- **NUNCA** expongas private keys en el frontend
- **NUNCA** commits private keys al repositorio
- En producción, las transacciones deben hacerse desde el backend
- Usa variables de entorno para todas las claves sensibles

### Recomendaciones
- Implementa rate limiting
- Valida todos los inputs del usuario
- Usa HTTPS en producción
- Implementa logging de transacciones
- Monitorea las transacciones en blockchain

## 📦 Dependencias Principales

```json
{
  "@chipi-pay/chipi-sdk": "^3.2.2",
  "@clerk/nextjs": "^6.23.3",
  "next": "15.3.5",
  "react": "^19.0.0",
  "viem": "^2.0.0",
  "react-hook-form": "^7.60.0",
  "tailwindcss": "^4"
}
```

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel
3. Deploy automático en cada push

### Otros
- Netlify
- Railway
- AWS Amplify

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o problemas:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación de Clerk y ChipiPay

## 🔄 Roadmap

- [ ] Integración con más blockchains
- [ ] Soporte para más tokens
- [ ] Dashboard de transacciones
- [ ] Notificaciones push
- [ ] API REST completa
- [ ] Tests automatizados
- [ ] CI/CD pipeline
