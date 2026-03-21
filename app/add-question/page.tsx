"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

type QuestionType = "multiple_choice" | "arrange_words" | "match_pairs";

const TYPES: { value: QuestionType; label: string }[] = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "arrange_words", label: "Arrange Words" },
  { value: "match_pairs", label: "Match Pairs" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function MultipleChoiceForm({ onSuccess }: { onSuccess: () => void }) {
  const addMultipleChoice = useMutation(api.questions.addMultipleChoice);

  const form = useForm({
    defaultValues: {
      topic: "",
      difficulty: 1,
      prompt: "",
      options: ["", ""],
      correctIndex: 0,
    },
    onSubmit: async ({ value }) => {
      await addMultipleChoice({
        type: "multiple_choice",
        topic: value.topic,
        difficulty: value.difficulty,
        prompt: value.prompt,
        options: value.options,
        correctIndex: value.correctIndex,
      });
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5 max-w-lg"
    >
      <CommonFields form={form} />

      <div className="flex flex-col gap-1">
        <FieldLabel>Prompt</FieldLabel>
        <form.Field name="prompt">
          {(field) => (
            <>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. What does 'kia ora' mean?"
              />
              <FieldError message={field.state.meta.errors[0]?.message} />
            </>
          )}
        </form.Field>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Options</FieldLabel>
        <form.Field name="options" mode="array">
          {(field) => (
            <>
              {field.state.value.map((_, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <form.Field name={`options[${i}]`}>
                    {(subField) => (
                      <Input
                        value={subField.state.value}
                        onBlur={subField.handleBlur}
                        onChange={(e) => subField.handleChange(e.target.value)}
                        placeholder={`Option ${i + 1}`}
                      />
                    )}
                  </form.Field>
                  <form.Field name="correctIndex">
                    {(ciField) => (
                      <button
                        type="button"
                        onClick={() => ciField.handleChange(i)}
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-colors ${
                          ciField.state.value === i
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}
                        title="Mark as correct"
                      />
                    )}
                  </form.Field>
                  {field.state.value.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => field.removeValue(i)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => field.pushValue("")}
              >
                + Add option
              </Button>
            </>
          )}
        </form.Field>
        <p className="text-xs text-muted-foreground">
          Click the circle next to an option to mark it as correct.
        </p>
      </div>

      <SubmitButton form={form} />
    </form>
  );
}

function ArrangeWordsForm({ onSuccess }: { onSuccess: () => void }) {
  const addArrangeWords = useMutation(api.questions.addArrangeWords);

  const form = useForm({
    defaultValues: {
      topic: "",
      difficulty: 1,
      correctSentence: "",
      words: [""],
    },
    onSubmit: async ({ value }) => {
      const sentenceWords = value.correctSentence.trim().split(/\s+/);
      const correctOrder = sentenceWords.map((w) => {
        const idx = value.words.indexOf(w);
        if (idx === -1)
          throw new Error(`Word "${w}" not found in words list`);
        return idx;
      });
      await addArrangeWords({
        type: "arrange_words",
        topic: value.topic,
        difficulty: value.difficulty,
        correctSentence: value.correctSentence,
        words: value.words,
        correctOrder,
      });
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5 max-w-lg"
    >
      <CommonFields form={form} />

      <div className="flex flex-col gap-1">
        <FieldLabel>Correct Sentence</FieldLabel>
        <form.Field name="correctSentence">
          {(field) => (
            <>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Ko tōku reo Māori"
              />
              <FieldError message={field.state.meta.errors[0]?.message} />
            </>
          )}
        </form.Field>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>Word Tiles (in display order)</FieldLabel>
        <p className="text-xs text-muted-foreground">
          Enter each word tile. Every word in the sentence must appear here.
        </p>
        <form.Field name="words" mode="array">
          {(field) => (
            <>
              {field.state.value.map((_, i) => (
                <div key={i} className="flex gap-2">
                  <form.Field name={`words[${i}]`}>
                    {(subField) => (
                      <Input
                        value={subField.state.value}
                        onBlur={subField.handleBlur}
                        onChange={(e) => subField.handleChange(e.target.value)}
                        placeholder={`Word ${i + 1}`}
                      />
                    )}
                  </form.Field>
                  {field.state.value.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => field.removeValue(i)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => field.pushValue("")}
              >
                + Add word
              </Button>
            </>
          )}
        </form.Field>
      </div>

      <SubmitButton form={form} />
    </form>
  );
}

function MatchPairsForm({ onSuccess }: { onSuccess: () => void }) {
  const addMatchPairs = useMutation(api.questions.addMatchPairs);

  const form = useForm({
    defaultValues: {
      topic: "",
      difficulty: 1,
      pairs: [{ teReo: "", english: "" }],
    },
    onSubmit: async ({ value }) => {
      await addMatchPairs({
        type: "match_pairs",
        topic: value.topic,
        difficulty: value.difficulty,
        pairs: value.pairs,
      });
      onSuccess();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5 max-w-lg"
    >
      <CommonFields form={form} />

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 text-sm font-medium text-muted-foreground">
          <span>Te Reo</span>
          <span>English</span>
        </div>
        <form.Field name="pairs" mode="array">
          {(field) => (
            <>
              {field.state.value.map((_, i) => (
                <div key={i} className="flex gap-2">
                  <form.Field name={`pairs[${i}].teReo`}>
                    {(subField) => (
                      <Input
                        value={subField.state.value}
                        onBlur={subField.handleBlur}
                        onChange={(e) => subField.handleChange(e.target.value)}
                        placeholder="e.g. whānau"
                      />
                    )}
                  </form.Field>
                  <form.Field name={`pairs[${i}].english`}>
                    {(subField) => (
                      <Input
                        value={subField.state.value}
                        onBlur={subField.handleBlur}
                        onChange={(e) => subField.handleChange(e.target.value)}
                        placeholder="e.g. family"
                      />
                    )}
                  </form.Field>
                  {field.state.value.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => field.removeValue(i)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => field.pushValue({ teReo: "", english: "" })}
              >
                + Add pair
              </Button>
            </>
          )}
        </form.Field>
      </div>

      <SubmitButton form={form} />
    </form>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CommonFields({ form }: { form: any }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1 flex-1">
        <FieldLabel>Topic</FieldLabel>
        <form.Field name="topic">
          {(field: any) => (
            <Input
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.handleChange(e.target.value)
              }
              placeholder="e.g. Greetings"
            />
          )}
        </form.Field>
      </div>
      <div className="flex flex-col gap-1 w-28">
        <FieldLabel>Difficulty (1–5)</FieldLabel>
        <form.Field name="difficulty">
          {(field: any) => (
            <Input
              type="number"
              min={1}
              max={5}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.handleChange(Number(e.target.value))
              }
            />
          )}
        </form.Field>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SubmitButton({ form }: { form: any }) {
  return (
    <form.Subscribe selector={(s) => s.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} className="self-start">
          {isSubmitting ? "Saving…" : "Add Question"}
        </Button>
      )}
    </form.Subscribe>
  );
}

export default function AddQuestionPage() {
  const [type, setType] = useState<QuestionType>("multiple_choice");
  const [successCount, setSuccessCount] = useState(0);
  const [formKey, setFormKey] = useState(0);

  const handleSuccess = () => {
    setSuccessCount((c) => c + 1);
    setFormKey((k) => k + 1);
  };

  return (
    <SidebarInset>
      <header className="flex h-12 items-center gap-2 px-4 border-b">
        <SidebarTrigger className="h-6 w-6" />
        <h1 className="text-xl font-bold">Add a question</h1>
      </header>

      <div className="p-6 flex flex-col gap-6">
        <div className="flex gap-2">
          {TYPES.map((t) => (
            <Button
              key={t.value}
              variant={type === t.value ? "default" : "outline"}
              onClick={() => {
                setType(t.value);
                setFormKey((k) => k + 1);
              }}
            >
              {t.label}
            </Button>
          ))}
        </div>

        {successCount > 0 && (
          <p className="text-sm text-green-600 font-medium">
            Question added successfully!
          </p>
        )}

        {type === "multiple_choice" && (
          <MultipleChoiceForm key={`mc-${formKey}`} onSuccess={handleSuccess} />
        )}
        {type === "arrange_words" && (
          <ArrangeWordsForm key={`aw-${formKey}`} onSuccess={handleSuccess} />
        )}
        {type === "match_pairs" && (
          <MatchPairsForm key={`mp-${formKey}`} onSuccess={handleSuccess} />
        )}
      </div>
    </SidebarInset>
  );
}
