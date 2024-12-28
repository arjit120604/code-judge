"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { contestSchema, type ContestInput } from "@/lib/zod";

export default function NewContestForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ContestInput>({
    resolver: zodResolver(contestSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      hidden: false,
      problems: [{
        title: "",
        description: "",
        difficulty: "EASY",
        points: 100,
        testcases: [{
          input: "",
          output: "",
          hidden: true
        }]
      }]
    }
  });

  const { fields: problemFields, append: appendProblem, remove: removeProblem } = useFieldArray({
    control: form.control,
    name: "problems"
  });

  async function onSubmit(data: ContestInput) {
    try {
      const res = await fetch('/api/contest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setError('Failed to create contest');
        return;
      }

      router.push('/contest');
    } catch (err) {
      setError('An unexpected error occurred');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Contest Basic Info */}
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contest Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contest title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Enter contest description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Problems Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Problems</h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => appendProblem({
                title: "",
                description: "",
                difficulty: "EASY",
                points: 100,
                testcases: [{ input: "", output: "", hidden: true }]
              })}
            >
              Add Problem
            </Button>
          </div>

          {problemFields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between">
                <h4 className="font-medium">Problem {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProblem(index)}
                >
                  Remove
                </Button>
              </div>

              {/* Problem Fields */}
              <FormField
                control={form.control}
                name={`problems.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Problem title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`problems.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Problem description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`problems.${index}.difficulty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`problems.${index}.points`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(+e.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Test Cases */}
              <TestCases form={form} problemIndex={index} />
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="hidden"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Hidden Contest</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Contest will not be visible until published
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit">Create Contest</Button>
        </div>
      </form>
    </Form>
  );
}

function TestCases({ form, problemIndex }: { form: any; problemIndex: number }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `problems.${problemIndex}.testcases`
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Test Cases</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ input: "", output: "", hidden: true })}
        >
          Add Test Case
        </Button>
      </div>

      {fields.map((field, testIndex) => (
        <div key={field.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h5 className="text-sm font-medium">Test Case {testIndex + 1}</h5>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(testIndex)}
            >
              Remove
            </Button>
          </div>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name={`problems.${problemIndex}.testcases.${testIndex}.input`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Test case input..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`problems.${problemIndex}.testcases.${testIndex}.output`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Output</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Expected output..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`problems.${problemIndex}.testcases.${testIndex}.hidden`}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Hidden Test Case</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}