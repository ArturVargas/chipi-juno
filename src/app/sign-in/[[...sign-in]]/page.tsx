import { SignIn } from '@clerk/nextjs'

// Clerk Sign In/Sign Up Page : https://clerk.com/docs/components/authentication/sign-in

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignIn />
    </div>
  )
}
