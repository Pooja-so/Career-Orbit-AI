"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, CheckCircle2, XCircle } from "lucide-react";

const QuizResult = ({ result, hideStartNew = false, onStartNew }) => {
  if (!result) return null;

  const { quizScore, improvementTip, questions } = result;

  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Results
      </h1>

      <CardContent className="space-y-6">
        {/* 1. Score Overview */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{quizScore.toFixed(1)}%</h3>

          <Progress
            value={quizScore}
            className="w-full"
          />
        </div>

        {/* 2. Improvement Tip */}
        {improvementTip && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Improvement Tip:</p>
            <p className="text-muted-foreground">{improvementTip}</p>
          </div>
        )}

        {/* 3. Questions Review */}
        <div className="space-y-4">
          <h3 className="font-medium">Question Review</h3>
          {questions.map((question, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{question.question}</p>
                {question.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Your answer: {question.userAnswer}</p>
                {!question.isCorrect && (
                  <p>Correct answer: {question.correctAnswer}</p>
                )}
              </div>
              <div className="text-sm bg-muted p-2 rounded">
                <p className="font-medium">Explanation:</p>
                <p>{question.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {/* After seeing quiz result, you can start new quiz */}
      {!hideStartNew && (
        <CardFooter>
          <Button onClick={onStartNew} className="w-full">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
};

export default QuizResult;
