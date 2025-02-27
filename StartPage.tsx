import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface StartPageProps {
  onStart: () => void
  onBack: () => void
}

export default function StartPage({ onStart, onBack }: StartPageProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-[#152e65] text-white text-center py-6 sm:py-8">
        <CardTitle className="text-2xl sm:text-4xl md:text-5xl font-bold">Welcome to the Crossing the Canyon Quiz!</CardTitle>
      </CardHeader>
      <CardContent className="mt-4 sm:mt-6 px-4 sm:px-8">
        <div className="flex justify-center mb-4 sm:mb-6">
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/pJihiXcffR8?si=c-epPombzD83nzAM"
            title="Crossing the Canyon Quiz Introduction"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="rounded-lg shadow-md"
          />
        </div>
        <p className="text-base sm:text-lg text-left mb-4 sm:mb-6">
          Young people these days are facing more challenges than ever before on their journey to adulthood—which makes
          your organization's role in helping them cross this canyon incredibly critical and necessary. This quiz is
          designed like a personality quiz: <span className="font-bold">choose 1 answer</span> for each question that
          describes your organization the best, and we'll show you how your organization fits into the larger ecosystem
          of helping youth thrive.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
      <Link href="https://flipbooklets.com/pdfflipbooklets/crossing-the-canyon#page1" target="_blank" className="w-full sm:flex-1">
            <Button className="w-full bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white">Explore Research</Button>
      </Link>
        <Button 
        onClick={onStart} className="w-full bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white">
          Start Now
        </Button>
      </CardFooter>
    </Card>
  )
}

