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

// 1. MODIFIED ZOD SCHEMA (UNCHANGED from previous update)
const QuizFormSchema = z.object({
    type: z.enum(["true/false", "multiple choice", "verbal answer"]),
    topic: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    amount: z.string().min(1, "Number of questions is required"),
    userId: z.string().min(1, "User ID is required"),
    pdfData: z.string().optional(),
    pdfName: z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.topic && !data.pdfData) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a topic or upload a PDF.",
            path: ["topic"],
        });
    }
});

type QuizFormValues = z.infer<typeof QuizFormSchema>

interface QuizFormProps {
    userId: string;
}

const QuizForm = ({ userId }: QuizFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const router = useRouter();

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
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            if (file.type !== 'application/pdf') {
                toast.error("Please upload a valid PDF file.");
                event.target.value = '';
                setFileName(null); // Clear selected file name
                form.setValue('pdfData', ''); // Clear PDF data
                form.setValue('pdfName', ''); // Clear PDF name
                return;
            }

            setFileName(file.name);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result?.toString().split(',')[1] || '';
                form.setValue('pdfData', base64String);
                form.setValue('pdfName', file.name);
                form.setValue('topic', ''); // Clear topic when file is selected
                form.clearErrors('topic'); // Clear topic errors
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                toast.error("Failed to read the file.");
                setFileName(null);
                form.setValue('pdfData', '');
                form.setValue('pdfName', '');
            };
        } else {
            // If file is cleared (e.g., user cancels file dialog)
            setFileName(null);
            form.setValue('pdfData', '');
            form.setValue('pdfName', '');
        }
    };

    const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        form.setValue('topic', event.target.value);
        if (event.target.value) {
            setFileName(null);
            form.setValue('pdfData', '');
            form.setValue('pdfName', '');
            const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        }
    }

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
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            await response.json();
            toast.success("Quiz generated successfully! Redirecting...");

            setTimeout(() => {
                router.push("/");
            }, 1500);

        } catch (error: any) {
            toast.error(`Failed to generate quiz: ${error.message}`);
            console.error("Quiz generation error:", error);
        } finally {
            setIsLoading(false);
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
                                            placeholder="Enter topic (e.g., Science, History)"
                                            {...field}
                                            onChange={handleTopicChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="text-center my-2">
                            <h3 className="text-gray-300">OR</h3>
                        </div>

                        {/* ADDED mb-4 FOR SPACING */}
                        <FormItem className="mb-4">
                            <FormLabel className="text-xl">Upload a PDF</FormLabel>
                            <FormControl>
                                <Input
                                    id="pdf-upload"
                                    type="file"
                                    accept=".pdf"
                                    className="pb-2.5 pt-2 text-gray-400 file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-200 file:text-dark-100 hover:file:bg-primary-200/80 h-full"
                                    onChange={handleFileChange}
                                />
                            </FormControl>
                            {fileName && <p className="text-sm text-green-400 mt-2">Selected: {fileName}</p>}
                            <FormMessage />
                        </FormItem>

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
                                            max="20"
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

export default QuizForm;