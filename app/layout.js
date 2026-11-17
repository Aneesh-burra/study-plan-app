import "./globals.css";

export const metadata = {
  title: "StudyLane: a study schedule built from your syllabi",
  description:
    "StudyLane is for college students juggling several courses. Upload your syllabi and notes and get a week-by-week study schedule, practice quizzes, and flashcards. $7/month.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
