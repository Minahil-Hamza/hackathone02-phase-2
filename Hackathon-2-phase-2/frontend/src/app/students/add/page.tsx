
import { StudentForm } from "@/components/students/StudentForm";
import { createStudent } from "@/lib/actions";

export const metadata = {
    title: "Add Student | EduTrack",
};

export default function AddStudentPage() {
  return (
    <StudentForm action={createStudent} />
  );
}
