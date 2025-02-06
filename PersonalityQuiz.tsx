"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { questions, results } from "./quizData";
import Chart2x2 from "./Chart2x2";
import StartPage from "./StartPage";
import OrganizationInfoPage from "./OrganizationInfoPage";
import { generatePDF } from "./utils/generatePDF";

export default function PersonalityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(-2);
  const [answerState, setAnswerState] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [xSum, setXSum] = useState(0);
  const [ySum, setYSum] = useState(0);
  const [orgName, setOrgName] = useState("");
  const [orgContact, setOrgContact] = useState("");

  const handleStart = () => setCurrentQuestion(-1);
  const handleOrgInfoSubmit = (name: string, contact: string) => {
    setOrgName(name);
    setOrgContact(contact);
    setCurrentQuestion(0);
  };

  const handleNext = () => {
    if (answerState[currentQuestion]) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentQuestion === 0) {
      setCurrentQuestion(-1);
    } else if (currentQuestion === -1) {
      setCurrentQuestion(-2);
    } else if (showResult) {
      setShowResult(false);
      setCurrentQuestion(questions.length - 1);
    }
  };

  const updateSums = (value: string, isReverting = false) => {
    const multiplier = isReverting ? -1 : 1;
    switch (value) {
      case "A":
        setYSum((prev) => prev + 1 * multiplier);
        setXSum((prev) => prev - 1 * multiplier);
        break;
      case "B":
        setXSum((prev) => prev + 1 * multiplier);
        setYSum((prev) => prev + 1 * multiplier);
        break;
      case "C":
        setYSum((prev) => prev - 1 * multiplier);
        setXSum((prev) => prev - 1 * multiplier);
        break;
      case "D":
        setXSum((prev) => prev + 1 * multiplier);
        setYSum((prev) => prev - 1 * multiplier);
        break;
    }
  };

  const handleAnswerChange = (value: string) => {
    const prevAnswer = answerState[currentQuestion];
    if (prevAnswer) updateSums(prevAnswer, true);
    updateSums(value);
    setAnswerState((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const calculateResult = () => {
    if (xSum >= 0 && ySum >= 0) return "B";
    if (xSum < 0 && ySum >= 0) return "A";
    if (xSum < 0 && ySum < 0) return "C";
    return "D";
  };

  const submitToGoogleSheets = async () => {
    const resultCategory = calculateResult();
    const responseData = {
      orgName,
      contactName: orgContact,
      answers: Object.values(answerState),
      xSum,
      ySum,
      resultCategory,
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbx0Ii9wtgJQplU7v6md1wI4f84Savq_eQScY6LU-DI6y8iE9L1Z1VvpsdUiG-jR4_tUgA/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseData),
      });

      console.log("Google Sheets Response:", await response.json());
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    if (showResult) submitToGoogleSheets();
  }, [showResult]);

  if (showResult) {
    const resultData = results[calculateResult()];
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-[#152e65] text-white">
          <CardTitle className="text-xl sm:text-2xl text-center">{orgName}</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 p-4 sm:p-6" id="result-content">
          <h2 className="text-2xl font-bold text-center mb-6">Your organization is mostly a...</h2>
          <h3 className="text-xl font-semibold text-center mb-4">{resultData.title}</h3>
          <div className="flex justify-center mb-6">
            <Chart2x2 xSum={xSum} ySum={ySum} />
          </div>
          <p className="mb-6 text-center text-lg">{resultData.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => generatePDF("result-content")}
            className="w-full sm:flex-1 bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white"
          >
            Download Result
          </Button>
          <Link href="https://www.reinventionlab.org/crossing-the-canyon" target="_blank" className="w-full sm:flex-1">
            <Button className="w-full bg-[#152e65] hover:bg-[#152e65]/90 text-white">
              Take me to the research
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-[#152e65] text-white">
        <CardTitle className="text-xl sm:text-2xl">Crossing the Canyon</CardTitle>
        <CardDescription className="text-white/80 text-sm sm:text-base">
          Question {currentQuestion + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4 p-4 sm:p-6">
        <Progress value={progress} className="mb-6 h-2" />
        <h2 className="text-lg sm:text-xl font-semibold mb-4">{question.question}</h2>
        <RadioGroup onValueChange={handleAnswerChange} value={answerState[currentQuestion] || ""}>
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value={option.id} id={`option-${option.id}`} />
              <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleBack}>Back</Button>
        <Button onClick={handleNext} disabled={!answerState[currentQuestion]}>
          {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}
