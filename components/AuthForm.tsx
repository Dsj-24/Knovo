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

import React from 'react'
import { toast } from "sonner"
import Link from "next/link"
import FormField from "./FormFeild"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { signIn, signUp } from "@/lib/actions/auth.action"
import { auth } from "@/firebase/client"

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
)

// Loading Overlay Component
const LoadingOverlay = ({ isLoading, message }: { isLoading: boolean; message: string }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
        <LoadingSpinner />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  )
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = AuthFormSchema(type);



  // Conventiional Loading method
  const [isLoading,setLoading] = useState(false);

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
      toast.error(`There was an error : ${e.message}`)
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

    <div className="card-border lg:min-w-[546px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">KNOVO</h2>
        </div>
        <h3 className="text-center">Practice Personalized quizzes with AI</h3>
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
            <Button className="btn" type="submit">{isSignIn ? 'Sign In' : 'Create an Account'}</Button>
          </form>
        </Form>

        <p className="text-center">{isSignIn ? 'No account yet' : 'Have an account already?'}
          <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">{!isSignIn ? "Sign In" : "Sign Up"}</Link>
        </p>
      </div></div></>
  )
}

export default AuthForm

function useState(arg0: boolean): [any, any] {
  throw new Error("Function not implemented.")
}
