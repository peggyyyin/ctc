import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface StartPageProps {
  onStart: () => void
}

export default function StartPage({ onStart }: StartPageProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-[#152e65] text-white text-center py-6 sm:py-8">
        <CardTitle className="text-2xl sm:text-4xl md:text-5xl font-bold">Welcome to the Canyon!</CardTitle>
      </CardHeader>
      <CardContent className="mt-4 sm:mt-6 px-4 sm:px-8">
        <div className="flex justify-center mb-4 sm:mb-6">
          <video
            className="rounded-lg shadow-md w-full aspect-video"
            controls
            poster="/placeholder.svg?height=400&width=1200"
          >
            <source src="/placeholder-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="text-base sm:text-lg text-left mb-4 sm:mb-6">
          Young people these days are facing more challenges than ever before on their journey to adulthood—which makes
          your organization's role in helping them cross this canyon incredibly critical and necessary. This quiz is
          designed like a personality quiz: <span className="font-bold">choose 1 answer</span> for each question that
          describes your organization the best, and we'll show you how your organization fits into the larger ecosystem
          of helping youth thrive.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pb-6 sm:pb-8">
        <Button onClick={() => window.history.back()} className="bg-gray-200 hover:bg-gray-300 text-gray-700">
          Back
        </Button>
        <Button
          onClick={onStart}
          className="bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3"
        >
          Start Now
        </Button>
      </CardFooter>
    </Card>
  )
}

