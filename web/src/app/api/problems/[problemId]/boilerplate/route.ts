import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

// Type mapping from C++ to Python
const cppToPythonType: Record<string, string> = {
  'int': 'int',
  'float': 'float',
  'double': 'float',
  'string': 'str',
  'bool': 'bool',
  'void': 'None',
  'vector<int>': 'List[int]',
  'vector<string>': 'List[str]',
  'vector<double>': 'List[float]',
  'vector<bool>': 'List[bool]',
  'pair<int,int>': 'Tuple[int, int]',
  'vector<vector<int>>': 'List[List[int]]',
  'vector<vector<string>>': 'List[List[str]]',
  'vector<vector<double>>': 'List[List[float]]'
};

export async function GET(
  req: Request,
  { params }: { params: { problemId: string } }
) {
  try {
    const problemId = params.problemId;
    const problemsDir = process.env.PROBLEMS_DIR as string;

    const files = await fs.readdir(problemsDir);
    
    
    // Convert problemId to filename format
    const problemFileName = `${problemId}.json`;
    const problemFile = files.find(file => file === problemFileName);

    if (!problemFile) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    const problemPath = path.join(problemsDir, problemFile);
    const problemData = JSON.parse(await fs.readFile(problemPath, 'utf-8'));

    // Generate boilerplate code based on the language
    const boilerplateCode = generateBoilerplate(problemData);

    return NextResponse.json({ boilerplate: boilerplateCode });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate boilerplate" },
      { status: 500 }
    );
  }
}

function generateBoilerplate(problemData: any) {
  const templates: Record<string, string> = {
    python: generatePythonBoilerplate,
    javascript: generateJavaScriptBoilerplate,
    cpp: generateCppBoilerplate,
  };

  const boilerplate: Record<string, { full: string, minimal: string }> = {};
  
  for (const [language, generator] of Object.entries(templates)) {
    const { full, minimal } = generator(
      problemData["Function name"],
      problemData["Input Fields"],
      problemData["Output Field"]
    );
    boilerplate[language] = { full, minimal };
  }

  return boilerplate;
}

function generatePythonBoilerplate(
  functionName: string,
  inputs: string[],
  output: string
): { full: string, minimal: string } {
  const params = inputs.map(input => {
    const [type, name] = input.split(' ');
    const pythonType = cppToPythonType[type] || 'Any';
    return `${name}: ${pythonType}`;
  }).join(', ');

  const returnType = cppToPythonType[output.split(' ')[0]] || 'Any';
  
  const minimal = `def ${functionName}(${params}) -> ${returnType}:
    # Write your code here
    pass`;

  const full = `from typing import List, Tuple, Any

${minimal}

# Example usage:
if __name__ == "__main__":
    # Add your test cases here
    pass`;

  return { full, minimal };
}

function generateJavaScriptBoilerplate(
  functionName: string,
  inputs: string[],
  output: string
): { full: string, minimal: string } {
  const params = inputs.map(input => input.split(' ')[1]).join(', ');
  
  const minimal = `function ${functionName}(${params}) {
    // Write your code here
}`;

  const full = `${minimal}

// Example usage:
// Add your test cases here`;

  return { full, minimal };
}

function generateCppBoilerplate(
  functionName: string,
  inputs: string[],
  output: string
): { full: string, minimal: string } {
  const params = inputs.join(', ');
  const returnType = output.split(' ')[0];
  
  const minimal = `${returnType} ${functionName}(${params}) {
    // Write your code here
}`;

  const full = `#include <vector>
#include <string>
using namespace std;

${minimal}

int main() {
    // Add your test cases here
    return 0;
}`;

  return { full, minimal };
} 
