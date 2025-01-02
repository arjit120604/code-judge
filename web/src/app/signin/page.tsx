"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authSchema, type AuthInput } from "@/lib/zod"
import Link from "next/link"

function FormInputField({ 
  name, 
  label, 
  placeholder, 
  type = "text", 
  control 
}: {
  name: keyof AuthInput;
  label: string;
  placeholder: string;
  type?: string;
  control: any;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm<AuthInput>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(data: AuthInput) {
    try {
      setError(null)
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid email or password')
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 p-8">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in
            </p>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md">
              {error}
            </div>
          )}

          <FormInputField 
            control={form.control} 
            name="email" 
            label="Email" 
            placeholder="you@example.com" 
            type="email"
          />
          <FormInputField 
            control={form.control} 
            name="password" 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}