"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CheckIcon, CircleXIcon, CrossIcon } from "lucide-react";

export default function Home() {
  const [seed, setSeed] = useState(0);
  const question = useQuery(api.questions.getRandomQuestion, { seed });

  function nextQuestion() {
    setSeed((s) => s + 1);
  }

  return (
    <main className="w-full max-w-xl p-2 h-screen">
      {/* <TeReoTitle /> */}

      {question === undefined && <p className="text-zinc-500">Loading…</p>}

      {question === null && (
        <p className="text-zinc-500">
          No questions yet. Add some via the Convex dashboard.
        </p>
      )}

      {question && question.type === "multiple_choice" && (
        <MultipleChoiceQuestion
          question={question}
          nextQuestion={nextQuestion}
        />
      )}

      {question && question.type === "arrange_words" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 uppercase tracking-wide">
            Arrange the words
          </p>
          <div className="flex flex-wrap gap-2">
            {question.words.map((word, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-800 dark:text-zinc-200 cursor-pointer border border-zinc-200 dark:border-zinc-700"
              >
                {word}
              </span>
            ))}
          </div>
          <p className="text-xs text-zinc-400">
            Answer: {question.correctSentence}
          </p>
        </div>
      )}

      {question && question.type === "match_pairs" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 uppercase tracking-wide">
            Match the pairs
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              {question.pairs.map((p, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-900 dark:text-green-200"
                >
                  {p.teReo}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {question.pairs.map((p, i) => (
                <Button
                  key={i}
                  className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-200"
                >
                  {p.english}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* <button
        onClick={nextQuestion}
        className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
      >
        Next Question
      </button> */}
    </main>
  );
}

const TeReoTitle = () => {
  return <h1 className="font-bold text-xl">Te Reo Duo</h1>;
};

const MultipleChoiceQuestion = ({
  question,
  nextQuestion,
}: {
  nextQuestion: () => void;
  question: {
    _id: Id<"questions">;
    _creationTime: number;
    type: "multiple_choice";
    difficulty: number;
    topic: string;
    prompt: string;
    options: string[];
    correctIndex: number;
  };
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const questionIsCorrect = selectedOption === question.correctIndex;

  return (
    <div className="h-full grid grid-rows-[auto_auto_1fr_auto]">
      <p className="text-lg font-bold">Select the correct translation</p>
      <p className="h-60 flex items-center justify-center font-medium text-lg">
        {question.prompt}
      </p>
      <div className="flex flex-col gap-4">
        {question.options.map((opt, i) => (
          <Button
            key={i}
            variant={"outline"}
            className={`h-12 text-md ${selectedOption === i ? "bg-secondary text-secondary-foreground" : ""}`}
            onClick={() => setSelectedOption(i)}
          >
            {opt}
          </Button>
        ))}
      </div>

      <AnsweredQuestionDrawer
        correctAnswer={question.options[question.correctIndex]}
        questionIsCorrect={questionIsCorrect}
        nextQuestion={nextQuestion}
      />
    </div>
  );
};

export function AnsweredQuestionDrawer({
  correctAnswer,
  questionIsCorrect,
  nextQuestion,
}: {
  correctAnswer: string;
  questionIsCorrect: boolean;
  nextQuestion: () => void;
}) {
  return (
    <Drawer key={"bottom"}>
      <DrawerTrigger asChild>
        <Button className="h-12 text-md">Check</Button>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
        <DrawerHeader>
          {questionIsCorrect ? (
            <CorrectHeaderContent />
          ) : (
            <IncorrectHeaderContent correctAnswer={correctAnswer} />
          )}
        </DrawerHeader>
        <DrawerFooter>
          <Button className="h-12 text-md" onClick={nextQuestion}>
            Next Question
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const IncorrectHeaderContent = ({
  correctAnswer,
}: {
  correctAnswer: string;
}) => {
  return (
    <>
      <DrawerTitle className="flex gap-2 text-destructive">
        <CircleXIcon></CircleXIcon>
        {"Incorrect"}
      </DrawerTitle>
      <DrawerDescription className="flex pt-2 text-destructive font-medium">
        Correct answer
      </DrawerDescription>
      <p className="text-destructive">{correctAnswer}</p>
    </>
  );
};

const CorrectHeaderContent = () => {
  return (
    <>
      <DrawerTitle className="flex gap-2 text-green-500">
        <CheckIcon></CheckIcon>
        {"Correct"}
      </DrawerTitle>
    </>
  );
};
