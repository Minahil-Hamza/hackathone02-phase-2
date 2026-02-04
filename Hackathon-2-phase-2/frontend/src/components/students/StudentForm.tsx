"use client";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/lib/definitions";
import { State } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, User, Mail, Calendar, Loader2 } from "lucide-react";

const StudentFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().int().positive('Age must be a positive number'),
});

type StudentFormData = z.infer<typeof StudentFormSchema>;

export function StudentForm({
  student,
  action,
}: {
  student?: Student;
  action: (state: State, formData: FormData) => Promise<State>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction, isPending] = useFormState(action, { message: null, errors: {} });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(StudentFormSchema),
    defaultValues: {
      name: student?.name || "",
      email: student?.email || "",
      age: student?.age || undefined,
    },
  });

  useEffect(() => {
    if (state.message && state.success) {
      toast({
        title: "Success",
        description: state.message,
      });
      router.push("/students");
      router.refresh();
    } else if (state.message && state.errors) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, router, toast]);

  const formErrors = state.errors || errors;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="rounded-lg hover:bg-muted">
          <Link href="/students">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Link>
        </Button>
      </div>

      <form action={formAction}>
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">
              {student ? "Edit Student" : "Add New Student"}
            </CardTitle>
            <CardDescription>
              {student
                ? "Update the student's information below."
                : "Fill in the details to register a new student."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter student's full name"
                className="rounded-lg h-11"
                {...register("name")}
                aria-invalid={!!formErrors.name}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                className="rounded-lg h-11"
                {...register("email")}
                aria-invalid={!!formErrors.email}
              />
              {formErrors.email && (
                <p className="text-sm text-destructive">{formErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter student's age"
                className="rounded-lg h-11"
                {...register("age")}
                aria-invalid={!!formErrors.age}
              />
              {formErrors.age && (
                <p className="text-sm text-destructive">{formErrors.age[0]}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-lg shadow-lg shadow-primary/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {student ? "Updating..." : "Creating..."}
                </>
              ) : (
                student ? "Update Student" : "Create Student"
              )}
            </Button>
            <Button type="button" variant="outline" className="rounded-lg" asChild>
              <Link href="/students">Cancel</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
