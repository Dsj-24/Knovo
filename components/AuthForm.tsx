"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const AuthFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(7) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6)
  })
}

import React, { useState } from 'react'
import { toast } from "sonner"
import Link from "next/link"
import FormField from "./FormFeild"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { signIn, signUp } from "@/lib/actions/auth.action"
import { auth } from "@/firebase/client"
import ForgotPasswordModal from "./ForgotPasswordModal"

const LoadingSpinner = () => (
  <div className="relative flex items-center justify-center">
    {/* Outer rotating ring with gradient effect */}
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600"></div>

    {/* Inner pulsing dot for extra visual appeal */}
    <div className="absolute animate-pulse rounded-full h-2 w-2 bg-blue-600"></div>
  </div>
)

// Enhanced Loading Overlay with smoother animations
const LoadingOverlay = ({ isLoading, message }: { isLoading: boolean; message: string }) => {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-6 shadow-2xl border border-gray-100 animate-slideIn">
        <LoadingSpinner />
        <div className="text-center">
          <p className="text-gray-700 font-semibold text-lg mb-2">{message}</p>
          <div className="flex justify-center space-x-1">
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = AuthFormSchema(type);

  // Conventiional Loading method
  const [isLoading,setLoading] = useState(false);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false); 

  // Definition of the form //
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // 2.Submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (type === 'sign-up') {
        const { name, email, password } = values;

        const userCreds = await createUserWithEmailAndPassword(auth, email, password);

        const result = await signUp({
          uid: userCreds.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Sucessfully Created. You will be directed to Sign In");
        router.push("/sign-in")
        console.log("Sign Up", values);
      } else {
         const { email, password } = values;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

  if (!userCredential?.user) {
    throw new Error("Sign-in failed: No user returned");
  }

  const idToken = await userCredential.user.getIdToken();
  if (!idToken) {
    throw new Error("Sign-in failed: No ID token");
  }

  await signIn({ email, idToken });
  toast.success("Successfully Signed In");
  router.push("/");
      }
    } catch (e:any) {
      toast.error(`There was an error : ${e.message}`);
      setLoading(false);
    }
    console.log(values)
  }

  const isSignIn = type === "sign-in"
  return (
    <>

     <LoadingOverlay 
        isLoading={isLoading} 
        message={isSignIn ? "Signing you in..." : "Creating your account..."} 
      />

       <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />

    <div className="card-border lg:min-w-[546px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center items-center mb-4">
          <Image src="/logo.svg" alt="logo" height={45} width={45} />
          <p className="text-5xl font-bold">KNOVO</p>
        </div>
        <h2 className="text-center text-2xl md:text-3xl">Practice Personalized quizzes with AI</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignIn && (<FormField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Your Name" />)}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email adress"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter Password"
              type="password" />

             {/* --- ADD THIS FORGOT PASSWORD LINK --- */}
              {isSignIn && (
                <div className="flex justify-end -mt-4">
                  <p
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-sm font-medium text-user-primary hover:underline cursor-pointer p-1"
                  >
                    Forgot Password?
                  </p>
                </div>
              )}
              {/* --- END OF ADDITION --- */}

              
            <Button className="btn text-2xl my-2" type="submit">{isSignIn ? 'Sign In' : 'Create Account'}</Button>
          </form>
        </Form>

        <p className="text-center text-xl">{isSignIn ? 'No account yet :' : 'Have an account already?'}
          <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-3">{!isSignIn ? "Sign In" : "Sign Up"}</Link>
        </p>
      </div></div></>
  )
}

export default AuthForm

