"use client"
import { neon } from '@neondatabase/serverless';
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
  
  const calculateResult = () => {
    let possibleResults: string[] = []
    if (xSum >= 0 && ySum >= 0) possibleResults.push("B")
    if (xSum <= 0 && ySum >= 0) possibleResults.push("A")
    if (xSum <= 0 && ySum <= 0) possibleResults.push("C")
    if (xSum >= 0 && ySum <= 0) possibleResults.push("D")
    return possibleResults
  }

  // Function to submit the data to the Neon SQL database
  const submitToDatabase = async () => {
    const resultCategories = calculateResult(); // Get result category
    const responseData = {
      organizationName: orgName,
      contactName: contactName,
      contactRole: contactRole,
      contactEmail: contactEmail,
      answers: Object.values(answerState),
      xSum,
      ySum,
      resultCategory: resultCategories.join(", "),
      timestamp: new Date().toISOString(),
    };

    try {
      // Connect to Neon Database
      const sql = neon(`${process.env.NEXT_PUBLIC_DATABASE_URL}`);
      console.log("Database URL: ", process.env.NEXT_PUBLIC_DATABASE_URL);


      if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
        console.error('NEXT_PUBLIC_DATABASE_URL is not defined in environment variables.');
        return;
      }      
      
      await sql`
        INSERT INTO survey_responses (
          organization_name, contact_name, contact_role, contact_email,
          question_1, question_2, question_3, question_4, question_5, question_6,
          question_7, question_8, question_9, question_10, question_11, question_12,
          x_sum, y_sum, result_category, timestamp
        ) VALUES (
          ${responseData.organizationName}, ${responseData.contactName}, ${responseData.contactRole}, ${responseData.contactEmail},
          ${responseData.answers[0]}, ${responseData.answers[1]}, ${responseData.answers[2]}, ${responseData.answers[3]},
          ${responseData.answers[4]}, ${responseData.answers[5]}, ${responseData.answers[6]}, ${responseData.answers[7]},
          ${responseData.answers[8]}, ${responseData.answers[9]}, ${responseData.answers[10]}, ${responseData.answers[11]},
          ${responseData.xSum}, ${responseData.ySum}, ${responseData.resultCategory}, ${responseData.timestamp}
        )
      `;
      console.log('Data inserted into database successfully');
    } catch (error) {
      console.error('Error inserting data into the database:', error);
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
        submitToDatabase() // Call submitToGoogleSheets when quiz finishes
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
      case "C":
        setYSum((prev) => prev - 1 * multiplier)
        setXSum((prev) => prev - 1 * multiplier)
        break
      case "skip":
        setYSum((prev) => prev)
        setXSum((prev) => prev)
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
    const resultCategories = calculateResult()
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
        <CardHeader className="bg-[#152e65] text-white">
          <CardTitle className="text-xl sm:text-2xl text-center">{orgName}</CardTitle>
        </CardHeader>
        <CardContent className="mt-4 p-4 sm:p-6" id="result-content">
          <h2 className="text-2xl font-bold text-center mb-6">Your organization is mostly a...</h2>
          <div className="flex justify-center mb-6">
            <Chart2x2 xSum={xSum} ySum={ySum} />
          </div>
          {resultCategories.map((category, index) => (
            <div key={category}>
              <h3 className="text-xl font-semibold text-center mb-4">{results[category as keyof typeof results].title}</h3>
              <p className="mb-6 text-center text-base text-left sm:text-lg">{results[category as keyof typeof results].description}</p>
              {index < resultCategories.length - 1 && <h3 className="text-lg font-semibold text-center mb-4">And you're also a...</h3>}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => generatePDF("result-content")}
            className="w-full sm:flex-1 bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white"
          >
            Download Result
          </Button>
          <Link href="https://flipbooklets.com/pdfflipbooklets/crossing-the-canyon#page1" target="_blank" className="w-full sm:flex-1">
            <Button className="w-full bg-[#152e65] hover:bg-[#152e65]/90 text-white">Explore the Research</Button>
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
        <CardDescription className="text-white/80 text-center text-sm sm:text-base">
          Question {currentQuestion + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4 p-4 sm:p-6">
        <Progress value={progress} className="mb-6 h-2" />
        <h2 className="text-lg sm:text-xl font-semibold mb-4">{question.question}</h2>
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


// "use client"
// import { neon } from '@neondatabase/serverless';
// import React, { useState } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Progress } from "@/components/ui/progress"
// import { questions, results } from "./quizData"
// import Chart2x2 from "./Chart2x2"
// import StartPage from "./StartPage"
// import OrganizationInfoPage from "./OrganizationInfoPage"
// import { generatePDF } from "./utils/generatePDF"

// export default function PersonalityQuiz() {
//   const [currentQuestion, setCurrentQuestion] = useState(-2) // -2 for StartPage, -1 for OrganizationInfoPage
//   const [answerState, setAnswerState] = useState<Record<number, string>>({})
//   const [showResult, setShowResult] = useState(false)
//   const [xSum, setXSum] = useState(0)
//   const [ySum, setYSum] = useState(0)
//   const [orgName, setOrgName] = useState("")
//   const [contactName, setContactName] = useState("")
//   const [contactRole, setContactRole] = useState("")
//   const [contactEmail, setContactEmail] = useState("")
  
//   const calculateResult = () => {
//     if (xSum >= 0 && ySum >= 0) return "B" //bridge builder
//     if (xSum < 0 && ySum >= 0) return "A" // trailguide
//     if (xSum < 0 && ySum < 0) return "C" // mapmaker
//     return "D" // transport
//   }

//   // Function to submit the data to the Neon SQL database
//   const submitToDatabase = async () => {
//     const resultCategory = calculateResult(); // Get result category
//     const responseData = {
//       organizationName: orgName,
//       contactName: contactName,
//       contactRole: contactRole,
//       contactEmail: contactEmail,
//       answers: Object.values(answerState),
//       xSum,
//       ySum,
//       resultCategory,
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       // Connect to Neon Database
//       const sql = neon(`${process.env.NEXT_PUBLIC_DATABASE_URL}`);
//       console.log("Database URL: ", process.env.NEXT_PUBLIC_DATABASE_URL);


//       if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
//         console.error('NEXT_PUBLIC_DATABASE_URL is not defined in environment variables.');
//         return;
//       }      
      
//       await sql`
//         INSERT INTO survey_responses (
//           organization_name, contact_name, contact_role, contact_email,
//           question_1, question_2, question_3, question_4, question_5, question_6,
//           question_7, question_8, question_9, question_10, question_11, question_12,
//           x_sum, y_sum, result_category, timestamp
//         ) VALUES (
//           ${responseData.organizationName}, ${responseData.contactName}, ${responseData.contactRole}, ${responseData.contactEmail},
//           ${responseData.answers[0]}, ${responseData.answers[1]}, ${responseData.answers[2]}, ${responseData.answers[3]}, 
//           ${responseData.answers[4]}, ${responseData.answers[5]}, ${responseData.answers[6]}, ${responseData.answers[7]},
//           ${responseData.answers[8]}, ${responseData.answers[9]}, ${responseData.answers[10]}, ${responseData.answers[11]},
//           ${responseData.xSum}, ${responseData.ySum}, ${responseData.resultCategory}, ${responseData.timestamp}
//         )
//       `;
//       console.log('Data inserted into database successfully');
//     } catch (error) {
//       console.error('Error inserting data into the database:', error);
//     }
//   };

//   const handleStart = () => {
//     setCurrentQuestion(-1)
//   }

//   const handleOrgInfoSubmit = (name: string, contactName: string, contactRole: string, contactEmail: string) => {
//     setOrgName(name)
//     setContactName(contactName)
//     setContactRole(contactRole)
//     setContactEmail(contactEmail)
//     setCurrentQuestion(0) // Move to first question
//   }

//   const handleBack = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1)
//     } else if (currentQuestion === 0) {
//       setCurrentQuestion(-1) // Go back to Organization Info
//     } else if (currentQuestion === -1) {
//       setCurrentQuestion(-2) // Go back to Start Page
//     } else if (showResult) {
//       setShowResult(false)
//       setCurrentQuestion(questions.length - 1) // Go back to last question
//     }
//   }


//   const handleNext = () => {
//     if (answerState[currentQuestion]) {
//       if (currentQuestion < questions.length - 1) {
//         setCurrentQuestion(currentQuestion + 1)
//       } else {
//         setShowResult(true)
//         submitToDatabase() // Call submitToGoogleSheets when quiz finishes
//       }
//     }
//   }

//   const updateSums = (value: string, isReverting = false) => {
//     const multiplier = isReverting ? -1 : 1
//     switch (value) {
//       case "A":
//         setYSum((prev) => prev + 1 * multiplier)
//         setXSum((prev) => prev - 1 * multiplier)
//         break
//       case "B":
//         setXSum((prev) => prev + 1 * multiplier)
//         setYSum((prev) => prev + 1 * multiplier)
//         break
//       case "C":
//         setYSum((prev) => prev - 1 * multiplier)
//         setXSum((prev) => prev - 1 * multiplier)
//         break
//       case "D":
//         setXSum((prev) => prev + 1 * multiplier)
//         setYSum((prev) => prev - 1 * multiplier)
//         break
//       case "C":
//         setYSum((prev) => prev - 1 * multiplier)
//         setXSum((prev) => prev - 1 * multiplier)
//         break
//       case "skip":
//         setYSum((prev) => prev)
//         setXSum((prev) => prev)
//         break
//     }
//   }
  
//   const handleAnswerChange = (value: string) => {
//     const prevAnswer = answerState[currentQuestion]
//     if (prevAnswer) {
//       updateSums(prevAnswer, true)
//     }
//     updateSums(value)
//     setAnswerState((prev) => ({
//       ...prev,
//       [currentQuestion]: value,
//     }))
//   }


//   const resetQuiz = () => {
//     setCurrentQuestion(-2)
//     setAnswerState({})
//     setShowResult(false)
//     setXSum(0)
//     setYSum(0)
//     setOrgName("")
//     setContactName("")
//     setContactRole("")
//     setContactEmail("")
//   }

//   if (currentQuestion === -2) {
//     return <StartPage onStart={handleStart} onBack={handleBack} />  // Pass onBack prop here
//   }

//   if (currentQuestion === -1) {
//     return <OrganizationInfoPage onSubmit={handleOrgInfoSubmit} onBack={handleBack} />
//   }

//   if (showResult) {
//     const result = calculateResult()
//     const resultData = results[result]
//     return (
//       <Card className="w-full max-w-2xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
//         <CardHeader className="bg-[#152e65] text-white">
//           <CardTitle className="text-xl sm:text-2xl text-center">{orgName}</CardTitle>
//         </CardHeader>
//         <CardContent className="mt-4 p-4 sm:p-6" id="result-content">
//           <h2 className="text-2xl font-bold text-center mb-6">Your organization is mostly a...</h2>
//           <h3 className="text-xl font-semibold text-center mb-4">{resultData.title}</h3>
//           <div className="flex justify-center mb-6">
//             <Chart2x2 xSum={xSum} ySum={ySum} />
//           </div>
//           <p className="mb-6 text-center text-base text-left sm:text-lg">{resultData.description}</p>
//         </CardContent>
//         <CardFooter className="flex flex-col sm:flex-row gap-4">
//           <Button
//             onClick={() => generatePDF("result-content")}
//             className="w-full sm:flex-1 bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white"
//           >
//             Download Result
//           </Button>
//           <Link href="https://flipbooklets.com/pdfflipbooklets/crossing-the-canyon#page1" target="_blank" className="w-full sm:flex-1">
//             <Button className="w-full bg-[#152e65] hover:bg-[#152e65]/90 text-white">Explore the Research</Button>
//           </Link>
//         </CardFooter>
//       </Card>
//     )
//   }

//   const question = questions[currentQuestion]
//   const progress = ((currentQuestion + 1) / questions.length) * 100

//   return (
//     <Card className="w-full max-w-2xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
//       <CardHeader className="bg-[#152e65] text-white">
//         <CardTitle className="text-xl sm:text-2xl">Crossing the Canyon</CardTitle>
//         <CardDescription className="text-white/80 text-center text-sm sm:text-base">
//           Question {currentQuestion + 1} of {questions.length}
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="mt-4 p-4 sm:p-6">
//         <Progress value={progress} className="mb-6 h-2" />
//         <h2 className="text-lg sm:text-xl font-semibold mb-4">{question.question}</h2>
//         <RadioGroup
//           key={currentQuestion} // Ensures a fresh render of the component for every question
//           onValueChange={handleAnswerChange}
//           value={answerState[currentQuestion] || ""} // Sets the selected value, or resets to empty
//         >
//           {question.options.map((option) => (
//             <div key={option.id} className="flex items-center space-x-2 mb-4">
//               <RadioGroupItem
//                 value={option.id}
//                 id={`option-${option.id}`}
//                 className="border-[#152e65] text-[#152e65]"
//               />
//               <Label htmlFor={`option-${option.id}`} className="text-base sm:text-lg">
//                 {option.text}
//               </Label>
//             </div>
//           ))}
//         </RadioGroup>
//       </CardContent>
//       <CardFooter className="flex justify-between gap-4">
//         <Button
//           onClick={handleBack}
//           disabled={currentQuestion === -2}
//           className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
//         >
//           Back
//         </Button>
//         <Button
//           onClick={handleNext}
//           disabled={!answerState[currentQuestion]}
//           className="flex-1 bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white"
//         >
//           {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }
