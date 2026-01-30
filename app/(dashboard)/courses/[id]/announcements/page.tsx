import { MOCK_COURSES } from "@/lib/constants/courses";
import AnnouncementsClient from "./client";

export async function generateStaticParams() {
  return MOCK_COURSES.map((course) => ({
    id: course.id,
  }));
}

export default function AnnouncementsPage() {
  return <AnnouncementsClient />;
}
