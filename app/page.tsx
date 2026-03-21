"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CircleCheckIcon, CircleXIcon } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 10000));
  const [previousIndex, setPreviousIndex] = useState<number | undefined>(
    undefined,
  );
  const question = useQuery(api.questions.getRandomQuestion, {
    seed,
    previousIndex,
  });

  const currentIndexRef = useRef<number | undefined>(undefined);
  if (question?._index !== undefined) {
    currentIndexRef.current = question._index;
  }

  function nextQuestion() {
    setPreviousIndex(currentIndexRef.current);
    setSeed(Math.floor(Math.random() * 10000));
  }

  return (
    <SidebarInset>
      <main className="w-full max-w-xl p-2 h-dvh">
        {question === null && (
          <p className="text-zinc-500">
            No questions yet. Add some via the Convex dashboard.
          </p>
        )}

        {question === undefined && <QuestionSkeleton />}

        {question && question.type === "multiple_choice" && (
          <MultipleChoiceQuestion
            question={question}
            nextQuestion={nextQuestion}
          />
        )}

        {question && question.type === "arrange_words" && (
          <ArrangeTheWords question={question} nextQuestion={nextQuestion} />
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
    </SidebarInset>
  );
}

const QuestionSkeleton = () => (
  <div className="h-full flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-muted border-t-foreground rounded-full animate-spin" />
  </div>
);

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
      <header className="flex h-12 items-center gap-2">
        <SidebarTrigger className="h-6 w-6" />
        <p className="text-xl font-bold">Select the correct translation</p>
      </header>

      <p className="h-60 flex items-center justify-center font-medium text-xl">
        {question.prompt}
      </p>
      <div className="flex flex-col gap-4">
        {question.options.map((opt, i) => (
          <Button
            key={i}
            variant={selectedOption === i ? "secondary" : "outline"}
            className={`h-12 text-lg`}
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
        <Button className="h-12 text-lg">Check</Button>
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
          <Button className="h-12 text-lg" onClick={nextQuestion}>
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
      <DrawerTitle className="flex gap-2 text-destructive text-lg items-center font-bold">
        <CircleXIcon className="mt-1" />
        {"Incorrect"}
      </DrawerTitle>
      <DrawerDescription className="flex flex-col items-start gap-2">
        <span className="pt-2 text-destructive font-medium text-lg">
          Correct answer:
        </span>
        <span className="text-destructive text-lg">{correctAnswer}</span>
      </DrawerDescription>
    </>
  );
};

const CorrectHeaderContent = () => {
  return (
    <>
      <DrawerTitle className="flex gap-2 text-green-500 text-lg items-center font-bold">
        <CircleCheckIcon className=""></CircleCheckIcon>
        {"Correct!"}
      </DrawerTitle>
    </>
  );
};

const ArrangeTheWords = ({
  question,
  nextQuestion,
}: {
  nextQuestion: () => void;
  question: {
    _id: Id<"questions">;
    _creationTime: number;
    type: "arrange_words";
    difficulty: number;
    topic: string;
    correctSentence: string;
    words: string[];
    correctOrder: number[];
    prompt: string;
  };
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const bankIndices = question.words
    .map((_, i) => i)
    .filter((i) => !selectedIndices.includes(i));

  const userSentence = selectedIndices.map((i) => question.words[i]).join(" ");
  const questionIsCorrect = userSentence === question.correctSentence;

  function selectWord(idx: number) {
    setSelectedIndices((prev) => [...prev, idx]);
  }

  function deselectWord(position: number) {
    setSelectedIndices((prev) => prev.filter((_, i) => i !== position));
  }

  return (
    <div className="h-full grid grid-rows-[auto_auto_1fr_auto]">
      <header className="flex h-12 items-center gap-2">
        <SidebarTrigger className="h-6 w-6" />
        <p className="text-xl font-bold">Arrange the words</p>
      </header>

      <p className="h-60 flex items-center justify-center font-medium text-xl">
        {question.prompt}
      </p>

      <div className="flex flex-col">
        <div className="flex-1 flex flex-wrap content-start gap-2 p-3 min-h-[80px] border-b border-dashed">
          {selectedIndices.length === 0 && (
            <span className="text-muted-foreground text-sm self-center">
              Tap words below to build your answer
            </span>
          )}
          {selectedIndices.map((wordIdx, position) => (
            <Button
              key={position}
              variant="outline"
              className="rounded-full px-3 h-8 text-sm"
              onClick={() => deselectWord(position)}
            >
              {question.words[wordIdx]}
            </Button>
          ))}
        </div>

        <div className="flex-1 flex flex-wrap content-start gap-2 p-3 min-h-[80px]">
          {bankIndices.map((wordIdx) => (
            <Button
              key={wordIdx}
              variant="outline"
              className="rounded-full px-3 h-8 text-sm"
              onClick={() => selectWord(wordIdx)}
            >
              {question.words[wordIdx]}
            </Button>
          ))}
        </div>
      </div>

      <AnsweredQuestionDrawer
        correctAnswer={question.correctSentence}
        questionIsCorrect={questionIsCorrect}
        nextQuestion={nextQuestion}
      />
    </div>
  );
};
