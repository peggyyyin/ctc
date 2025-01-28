import PersonalityQuiz from "../PersonalityQuiz"
import LayoutWrapper from "@/components/layout-wrapper"

export default function Home() {
  return (
    <LayoutWrapper>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
        <PersonalityQuiz />
      </main>
    </LayoutWrapper>
  )
}

