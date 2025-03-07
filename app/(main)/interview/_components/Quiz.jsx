"use client"; // It is a client component as we are going to use hooks and events like onClick

import { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./QuizResult";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Quiz = () => {
  // Handling state of MCQ selection
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Backend API call for genrating quiz and saving result are done in useFetch() hook
  const {
    loading: generatingQuiz,
    makeAPICall: generateQuizfunction,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    makeAPICall: saveQuizResultFunction,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  //  when the quiz answer changes
  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  //    Updating answers state
  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    // Check if current question is not the last question, move to the next question
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz(); // If last quetsion then finish quiz
    }
  };

  const calculateQuizScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100; // percentage
  };

  //   After quiz is finished, we will store the result in the database
  const finishQuiz = async () => {
    const score = calculateQuizScore();
    try {
      await saveQuizResultFunction(quizData, answers, score);
      toast.success("Quiz completed");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  // After quiz is finished, we will start a new quiz fresh from start
  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizfunction();
    setResultData(null);
  };

  //   Displaying a loader till the quiz is getting generated
  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  // Show results if quiz is completed
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  //  Initially, we will display the Card containing start quiz button. During that period quizData will be empty.
  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuizfunction} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];
  return (
    <Card className="mx-2">
      {/* 1.Title:  Question no. */}
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      {/* 2. Content:  Question with options and short answer explanation */}
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>

      {/* 3. Footer: showExplanation Button and Next/Finish button */}
      <CardFooter>
        <div className="flex gap-4">
          {/* 3.1 If not last question, display next button else finish button*/}
          <TooltipProvider>
            <Tooltip>
              {/* Use asChild inside TooltipTrigger: Ensures the button (inside <span>) acts as the trigger. */}
              <TooltipTrigger asChild>
                <span className="cursor-pointer">
                  {/* Wrap Button in a span because disabled buttons don't trigger hover events */}
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestion] || savingResult}
                    className={`transition-all active:scale-95 ${
                      currentQuestion < quizData.length - 1
                        ? ""
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {savingResult && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {!savingResult && currentQuestion < quizData.length - 1
                      ? "Next Question"
                      : "Finish Quiz"}
                  </Button>
                </span>
              </TooltipTrigger>
              {/* Only show the tooltip when answer is not selecetd
             and savingResult is false */}
              {!answers[currentQuestion] && !savingResult && (
                <TooltipContent className="font-semibold text-red-600 text-sm bg-red-100">
                  Please select an answer
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          {/* 3.2 showExplanation button will be enabled only when you have selected any option */}
          {!showExplanation && (
            <Button
              onClick={() => setShowExplanation(true)}
              variant="outline"
              disabled={!answers[currentQuestion]}
              className="cursor-pointer ml-auto"
            >
              Show Explanation
            </Button>
          )}
          {showExplanation && (
            <Button
              onClick={() => setShowExplanation(false)}
              variant="outline"
              className="cursor-pointer ml-auto"
            >
              Hide Explanation
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
