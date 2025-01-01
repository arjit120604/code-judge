'use client';
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { FormField, FormItem, FormLabel, FormControl } from "./ui/form";

type TestCaseInputProps = {
  form: any;
  problemIndex: number;
  testIndex: number;
  onValidate: (input: string, output: string) => Promise<boolean>;
};

export function TestCaseInput({ form, problemIndex, testIndex, onValidate }: TestCaseInputProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<boolean | null>(null);

  const handleValidate = async () => {
    const input = form.getValues(`problems.${problemIndex}.testcases.${testIndex}.input`);
    const output = form.getValues(`problems.${problemIndex}.testcases.${testIndex}.output`);

    setIsValidating(true);
    try {
      const isValid = await onValidate(input, output);
      setValidationResult(isValid);
    } catch (error) {
      setValidationResult(false);
    }
    setIsValidating(false);
  };

  return (
    <div className="space-y-4">
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

        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleValidate}
            disabled={isValidating}
          >
            {isValidating ? "Validating..." : "Validate Test Case"}
          </Button>
          {validationResult !== null && (
            <span className={validationResult ? "text-green-600" : "text-red-600"}>
              {validationResult ? "✓ Valid" : "✗ Invalid"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 