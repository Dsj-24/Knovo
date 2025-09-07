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

// Using native HTML select elements instead of shadcn Select

const QuizFormSchema = z.object({
    type: z.enum(["true/false", "multiple choice", "verbal answer"]),
    topic: z.string().min(1, "Topic is required"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    amount: z.string().min(1, "Number of questions is required"),
    userId: z.string().min(1, "User ID is required")
})

type QuizFormValues = z.infer<typeof QuizFormSchema>





interface QuizFormProps {
    userId: string;
}



const QuizForm = ({ userId }: QuizFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<QuizFormValues>({
        resolver: zodResolver(QuizFormSchema),
        defaultValues: {
            type: "multiple choice",
            topic: "",
            difficulty: "medium",
            amount: "",
            userId: userId,
        },
    })

    async function onSubmit(values: QuizFormValues) {
        setIsLoading(true);

        try {
            const response = await fetch("https://knovo-dhlb.vercel.app/api/vapi/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            toast.success("Quiz generated successfully!");
            console.log("Quiz generation result:", result);

            // Reset form after successful submission
            form.reset({
                type: "multiple choice",
                topic: "",
                difficulty: "medium",
                amount: "",
                userId: userId,
            }
          
            );
           router.push("/");
        } catch (error: any) {
            toast.error(`Failed to generate quiz: ${error.message}`);
            console.error("Quiz generation error:", error);
        } 
    }

    return (
        <div className="card-border lg:min-w-[546px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center items-center">
                 
                       <Image src="/logo.svg" alt="logo" width={34} height={60} />
                    
                    <h2 className="text-primary-100">KNOVO</h2>
                </div>
                <h2 className="text-center">Generate Your Personalized Quiz</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">

                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl">Quiz Topic</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter quiz topic (e.g., Brain Rot, Science, History)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl" >Quiz Type</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select quiz type</option>
                                            <option value="true/false">True/False</option>
                                            <option value="multiple choice">Multiple Choice</option>
                                            <option value="verbal answer">Verbal Answer</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl">Difficulty Level</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select difficulty</option>
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl" >Number of Questions</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter number of questions (e.g., 7)"
                                            min="1"
                                            max="50"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            className="btn w-full h-12 text-xl mt-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Generating Quiz..." : "Generate Quiz"}
                        </Button>
                    </form>
                </Form>

            </div>
            
        </div>
    )
}

export default QuizForm