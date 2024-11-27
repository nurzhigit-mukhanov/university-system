export async function registerCourse(
  courseId: string,
  studentId: string
): Promise<void> {
  const response = await fetch(`/api/registerCourse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, studentId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to register course ${courseId}`);
  }
}
