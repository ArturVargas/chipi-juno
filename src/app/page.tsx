import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Pay Services with <span className="text-blue-600">Stablecoins</span>
                <span className="text-xl block mt-2 font-normal text-gray-600">(Yes, it&apos;s that easy! 🚀)</span>
              </h1>
              <p className="text-xl text-gray-600">
                Thanks to Arbitrum and MXNB tokens, we&apos;ve made paying for services like CFE, streaming, and more super simple and secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <SignedOut>
                  <SignUpButton
                    mode="modal"
                    forceRedirectUrl="/dashboard"
                    signInForceRedirectUrl="/dashboard"
                  >
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                      Start Paying Services
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                      Go to Dashboard
                    </button>
                  </Link>
                </SignedIn>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full z-0"></div>
              <div className="relative z-10">
                <Image
                  src="/chipi.png"
                  alt="BipsiPay Logo"
                  width={400}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blockchain Callout */}
      <section className="py-10 bg-blue-600 text-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">Powered by Arbitrum & MXNB = Secure Service Payments</h2>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why BipsiPay Services Rocks</h2>
            <p className="text-lg text-gray-600">No complicated processes, just simple and secure payments.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Wallets</h3>
              <p className="text-gray-600">
                Create your own wallet with PIN protection. Your keys, your control.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Payments</h3>
              <p className="text-gray-600">Pay for CFE, streaming, and other services instantly on Arbitrum.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Balance</h3>
              <p className="text-gray-600">See your MXNB balance in real-time. No surprises, just transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
                         <h2 className="text-3xl font-bold mb-4">How It Works (It&apos;s Super Easy!)</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Create Wallet</h3>
              <p className="text-gray-600">Sign up and create your secure wallet with a PIN. Takes 30 seconds! ⏱️</p>
            </div>

            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
                             <h3 className="text-xl font-bold mb-2">Choose Service</h3>
               <p className="text-gray-600">Browse services like CFE, streaming, and more. Pick what you need! 💡</p>
             </div>

             <div className="flex-1 text-center">
               <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                 3
               </div>
               <h3 className="text-xl font-bold mb-2">Pay &amp; Confirm</h3>
               <p className="text-gray-600">Enter details, confirm with PIN, and done! Transaction on blockchain! 🎉</p>
             </div>
           </div>

           <div className="mt-12 text-center">
             <SignedOut>
               <SignUpButton
                 mode="modal"
                 forceRedirectUrl="/dashboard"
                 signInForceRedirectUrl="/dashboard"
               >
                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                   I&apos;m Ready! Let&apos;s Start
                 </button>
               </SignUpButton>
             </SignedOut>
             <SignedIn>
               <Link href="/dashboard">
                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                   I&apos;m Ready! Let&apos;s Start
                 </button>
               </Link>
             </SignedIn>
           </div>
         </div>
       </section>

       {/* Services Preview */}
       <section className="py-16">
         <div className="container max-w-6xl mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold mb-4">Available Services</h2>
             <p className="text-lg text-gray-600">Pay for your favorite services with blockchain technology</p>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
               <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-yellow-600 text-xl">⚡</span>
               </div>
               <h3 className="text-lg font-bold mb-2">CFE</h3>
               <p className="text-gray-600 text-sm">Pay your electricity bill</p>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-red-600 text-xl">📺</span>
               </div>
               <h3 className="text-lg font-bold mb-2">Streaming</h3>
               <p className="text-gray-600 text-sm">Netflix, Disney+, and more</p>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-green-600 text-xl">📱</span>
               </div>
               <h3 className="text-lg font-bold mb-2">Mobile</h3>
               <p className="text-gray-600 text-sm">Phone recharges</p>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-purple-600 text-xl">🏠</span>
               </div>
               <h3 className="text-lg font-bold mb-2">General</h3>
               <p className="text-gray-600 text-sm">Other services</p>
             </div>
           </div>
         </div>
       </section>

       {/* Testimonial */}
       <section className="py-16">
         <div className="container max-w-6xl mx-auto px-4">
           <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
             <div className="flex items-center mb-6">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                 <span className="text-blue-600 font-bold text-xl">MV</span>
               </div>
               <div>
                 <h4 className="text-xl font-bold">María &quot;Tech Savvy&quot; Vargas</h4>
                 <p className="text-gray-500">Loves blockchain payments</p>
               </div>
             </div>
             <p className="text-xl italic text-gray-600">
               &quot;I used to spend hours waiting in line to pay my CFE bill. Now with BipsiPay, I just click a few buttons and it&apos;s done! 
               The blockchain technology makes it so secure and fast. No more paper receipts! 🚀&quot;
             </p>
           </div>
         </div>
       </section>

       {/* Final CTA */}
       <section className="py-16 bg-blue-600 text-white">
         <div className="container max-w-6xl mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Pay Services with Blockchain?</h2>
           <SignedOut>
             <SignUpButton
               mode="modal"
               forceRedirectUrl="/dashboard"
               signInForceRedirectUrl="/dashboard"
             >
               <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                 Let&apos;s Get Started!
               </button>
             </SignUpButton>
           </SignedOut>
           <SignedIn>
             <Link href="/dashboard">
               <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                 Let&apos;s Get Started!
               </button>
             </Link>
           </SignedIn>
         </div>
       </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-300">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">
            <span className="font-bold text-white">BipsiPay Services</span> — Powered by Arbitrum for Secure Service Payments
          </p>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} BipsiPay Services. Making blockchain payments simple and secure.
          </p>
        </div>
      </footer>
    </div>
  );
}
