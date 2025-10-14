"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"

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

// ✅ ROBUST ZOD SCHEMA (treats "", spaces as empty; validates topic OR pdf)
const QuizFormSchema = z
  .object({
    type: z.enum(["true/false", "multiple choice", "verbal answer"]),
    topic: z
      .string()
      .transform((v) => (v ?? "").trim())
      .optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    amount: z.string().min(1, "Number of questions is required"),
    userId: z.string().min(1, "User ID is required"),
    pdfData: z.string().optional(),
    pdfName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasTopic = (data.topic ?? "").trim().length > 0
    const hasPdf = (data.pdfData ?? "").length > 0
    if (!hasTopic && !hasPdf) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a topic or upload a PDF.",
        path: ["topic"],
      })
    }
  })

type QuizFormValues = z.infer<typeof QuizFormSchema>

interface QuizFormProps {
  userId: string
}

const QuizForm = ({ userId }: QuizFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(QuizFormSchema),
    defaultValues: {
      type: "multiple choice",
      topic: "",
      difficulty: "medium",
      amount: "5",
      userId: userId,
      pdfData: "",
      pdfName: "",
    },
    mode: "onChange",
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a valid PDF file.")
        event.target.value = ""
        setFileName(null)
        form.setValue("pdfData", "", { shouldValidate: true })
        form.setValue("pdfName", "", { shouldValidate: false })
        form.trigger(["topic", "pdfData"])
        return
      }

      setFileName(file.name)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result?.toString().split(",")[1] || ""
        form.setValue("pdfData", base64String, { shouldValidate: true })
        form.setValue("pdfName", file.name, { shouldValidate: false })
        form.setValue("topic", "", { shouldValidate: true }) // clear topic when file selected
        form.clearErrors(["topic", "pdfData"])
        form.trigger(["topic", "pdfData"]) // ✅ re-validate immediately
      }
      reader.onerror = (error) => {
        console.error("Error reading file:", error)
        toast.error("Failed to read the file.")
        setFileName(null)
        form.setValue("pdfData", "", { shouldValidate: true })
        form.setValue("pdfName", "", { shouldValidate: false })
        form.trigger(["topic", "pdfData"])
      }
    } else {
      // User cleared file picker
      setFileName(null)
      form.setValue("pdfData", "", { shouldValidate: true })
      form.setValue("pdfName", "", { shouldValidate: false })
      form.trigger(["topic", "pdfData"])
    }
  }

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    form.setValue("topic", value, { shouldValidate: true })

    if (value) {
      // Clear any selected file when topic is typed
      setFileName(null)
      form.setValue("pdfData", "", { shouldValidate: true })
      form.setValue("pdfName", "", { shouldValidate: false })
      const fileInput = document.getElementById("pdf-upload") as HTMLInputElement | null
      if (fileInput) fileInput.value = ""
    }

    form.clearErrors(["topic", "pdfData"])
    form.trigger(["topic", "pdfData"]) // ✅ re-validate immediately
  }

  async function onSubmit(values: QuizFormValues) {
    setIsLoading(true)

    try {
      const response = await fetch("https://knovo-dhlb.vercel.app/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      await response.json()
      toast.success("Quiz generated successfully! Redirecting...")
      setTimeout(() => {
        router.push("/")
      }, 500)
    } catch (error: any) {
      toast.error(`Failed to generate quiz: ${error.message}`)
      console.error("Quiz generation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 p-1 rounded-3xl shadow-2xl lg:min-w-[546px] w-full max-w-5xl">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl">
        <div className="flex flex-col gap-6 py-14 px-10">
          <div className="flex flex-row gap-2 justify-center items-center mb-3">
            <Image src="/logo.svg" alt="logo" width={34} height={60} />
            <h2 className="text-4xl text-primary-200">KNOVO</h2>
          </div>
          <h2 className="text-center text-4xl">Generate Your Personalized Quiz</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 mb-4 form">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl text-white font-semibold">Quiz Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter topic (e.g., Science, History)"
                        {...field}
                        onChange={handleTopicChange} // ✅ mirrors validation behavior
                        className="lg:text-xl p-6 mb-3 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </FormControl>
                    <FormMessage className="text-pink-400" />
                  </FormItem>
                )}
              />

              <div className="text-center my-2">
                <h2 className="text-gray-300 text-xl md:text-2xl mb-3 mt-3 font-semibold">OR</h2>
              </div>

              {/* ✅ File input now wired to handler & validates immediately */}
              <FormItem className="mb-10">
                <FormLabel className="text-2xl text-white font-semibold">Upload a PDF</FormLabel>
                <FormControl>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileChange} // ✅ important
                    className="pb-3.5 pt-3 text-gray-400 text-xl file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-xl file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:text-white hover:file:from-purple-600 hover:file:to-pink-600 h-full bg-slate-800/50 border-purple-500/30 focus:border-purple-400"
                  />
                </FormControl>
                {fileName && <p className="text-sm text-green-400 mt-2">Selected: {fileName}</p>}
                <FormMessage className="text-pink-400" />
              </FormItem>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl text-white font-semibold">Quiz Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-13 text-xl w-full rounded-md border border-purple-500/30 bg-slate-800/50 text-white px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:border-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="" className="bg-slate-800 text-white">Select quiz type</option>
                        <option value="true/false" className="bg-slate-800 text-white">True/False</option>
                        <option value="multiple choice" className="bg-slate-800 text-white">Multiple Choice</option>
                        <option value="verbal answer" className="bg-slate-800 text-white">Verbal Answer</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-pink-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl text-white font-semibold">Difficulty Level</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-13 text-xl w-full rounded-md border border-purple-500/30 bg-slate-800/50 text-white px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-lg file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:border-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="" className="bg-slate-800 text-white">Select difficulty</option>
                        <option value="easy" className="bg-slate-800 text-white">Easy</option>
                        <option value="medium" className="bg-slate-800 text-white">Medium</option>
                        <option value="hard" className="bg-slate-800 text-white">Hard</option>
                      </select>
                    </FormControl>
                    <FormMessage className="text-pink-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl text-white font-semibold">Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of questions (e.g., 7)"
                        min="1"
                        max="20"
                        {...field}
                        className="h-13 text-2xl mb-6 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </FormControl>
                    <FormMessage className="text-pink-400" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full h-15 text-3xl mt-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:from-purple-700 hover:via-pink-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Generating Quiz..." : "Generate Quiz"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default QuizForm
