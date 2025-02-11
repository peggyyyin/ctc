"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { questions, results } from "./quizData"
import Chart2x2 from "./Chart2x2"
import StartPage from "./StartPage"
import OrganizationInfoPage from "./OrganizationInfoPage"
import { generatePDF } from "./utils/generatePDF"

export default function PersonalityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(-2) // -2 for StartPage, -1 for OrganizationInfoPage
  const [answerState, setAnswerState] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [xSum, setXSum] = useState(0)
  const [ySum, setYSum] = useState(0)
  const [orgName, setOrgName] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactRole, setContactRole] = useState("")
  const [contactEmail, setContactEmail] = useState("")

  const submitToGoogleSheets = async () => {
    const resultCategory = calculateResult(); // Get result category
    const responseData = {
      organizationName: orgName,
      contactName: contactName,
      contactRole: contactRole,
      contactEmail: contactEmail,
      answers: Object.values(answerState), // Assuming answers is an object of answers
      xSum,
      ySum,
      resultCategory,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/save-data/save-to-google-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });

    // Check if the response is a valid JSON response
    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      if (result.success) {
        console.log('Data saved to Google Sheets');
      } else {
        console.error('Failed to save data to Google Sheets');
      }
    } else {
      // If the response is not JSON, print the response text
      console.error('Invalid response format:', await response.text());
    }
  } catch (error) {
    console.error('Error submitting data', error);
  }
};

  const handleStart = () => {
    setCurrentQuestion(-1)
  }

  const handleOrgInfoSubmit = (name: string, contactName: string, contactRole: string, contactEmail: string) => {
    setOrgName(name)
    setContactName(contactName)
    setContactRole(contactRole)
    setContactEmail(contactEmail)
    setCurrentQuestion(0) // Move to first question
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else if (currentQuestion === 0) {
      setCurrentQuestion(-1) // Go back to Organization Info
    } else if (currentQuestion === -1) {
      setCurrentQuestion(-2) // Go back to Start Page
    } else if (showResult) {
      setShowResult(false)
      setCurrentQuestion(questions.length - 1) // Go back to last question
    }
  }


  const handleNext = () => {
    if (answerState[currentQuestion]) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setShowResult(true)
        submitToGoogleSheets() // Call submitToGoogleSheets when quiz finishes
      }
    }
  }

  const updateSums = (value: string, isReverting = false) => {
    const multiplier = isReverting ? -1 : 1
    switch (value) {
      case "A":
        setYSum((prev) => prev + 1 * multiplier)
        setXSum((prev) => prev - 1 * multiplier)
        break
      case "B":
        setXSum((prev) => prev + 1 * multiplier)
        setYSum((prev) => prev + 1 * multiplier)
        break
      case "C":
        setYSum((prev) => prev - 1 * multiplier)
        setXSum((prev) => prev - 1 * multiplier)
        break
      case "D":
        setXSum((prev) => prev + 1 * multiplier)
        setYSum((prev) => prev - 1 * multiplier)
        break
    }
  }

  const handleAnswerChange = (value: string) => {
    const prevAnswer = answerState[currentQuestion]
    if (prevAnswer) {
      updateSums(prevAnswer, true)
    }
    updateSums(value)
    setAnswerState((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }))
  }

  const calculateResult = () => {
    if (xSum >= 0 && ySum >= 0) return "B"
    if (xSum < 0 && ySum >= 0) return "A"
    if (xSum < 0 && ySum < 0) return "C"
    return "D"
  }

  const resetQuiz = () => {
    setCurrentQuestion(-2)
    setAnswerState({})
    setShowResult(false)
    setXSum(0)
    setYSum(0)
    setOrgName("")
    setContactName("")
    setContactRole("")
    setContactEmail("")
  }

  if (currentQuestion === -2) {
    return <StartPage onStart={handleStart} onBack={handleBack} />  // Pass onBack prop here
  }

  if (currentQuestion === -1) {
    return <OrganizationInfoPage onSubmit={handleOrgInfoSubmit} onBack={handleBack} />
  }

  if (showResult) {
    const result = calculateResult()
    const resultData = results[result]
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
        <CardHeader className="bg-[#152e65] text-white">
          <CardTitle className="text-xl sm:text-2xl text-center">{orgName}</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 p-4 sm:p-6" id="result-content">
          <h2 className="text-2xl font-bold text-center mb-6">Your organization is mostly a...</h2>
          <h3 className="text-xl font-semibold text-center mb-4">{resultData.title}</h3>
          <div className="flex justify-center mb-6">
            <Chart2x2 xSum={xSum} ySum={ySum} />
          </div>
          <p className="mb-6 text-center text-base text-left sm:text-lg">{resultData.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => generatePDF("result-content")}
            className="w-full sm:flex-1 bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white"
          >
            Download Result
          </Button>
          <Link href="https://www.reinventionlab.org/crossing-the-canyon" target="_blank" className="w-full sm:flex-1">
            <Button className="w-full bg-[#152e65] hover:bg-[#152e65]/90 text-white">Take me to the research</Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-[#152e65] text-white">
        <CardTitle className="text-xl sm:text-2xl">Crossing the Canyon</CardTitle>
        <CardDescription className="text-white/80 text-sm sm:text-base">
          Question {currentQuestion + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4 p-4 sm:p-6">
        <Progress value={progress} className="mb-6 h-2" />
        <h2 className="text-lg sm:text-xl text-center font-semibold mb-4">{question.question}</h2>
        <RadioGroup
          key={currentQuestion} // Ensures a fresh render of the component for every question
          onValueChange={handleAnswerChange}
          value={answerState[currentQuestion] || ""} // Sets the selected value, or resets to empty
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 mb-4">
              <RadioGroupItem
                value={option.id}
                id={`option-${option.id}`}
                className="border-[#152e65] text-[#152e65]"
              />
              <Label htmlFor={`option-${option.id}`} className="text-base sm:text-lg">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button
          onClick={handleBack}
          disabled={currentQuestion === -2}
          className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answerState[currentQuestion]}
          className="flex-1 bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white"
        >
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  )
}
