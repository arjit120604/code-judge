import { cppToPythonType, cppToJavaScriptType } from './types/TypeMappings';

export default class FullProblemDefinitionGenerator {
    problemName: string ="";
    functionName: string ="";
    inputFields: { type: string; name: string; }[] = [];
    outputFields: { type: string; name: string; }[] = [];

    parse(input: string) {
        const lines = input.split('\n').map(line => line.trim());

        let currStructure: string | null = null;

        lines.forEach(line => {
            if (line.startsWith('Problem Name:')){
                this.problemName = line.split(':')[1].trim();
            } else if (line.startsWith('Function Name:')){
                this.functionName = line.split(':')[1].trim();
            } else if (line.startsWith('Input Structure:')){
                currStructure = 'input';
            } else if (line.startsWith('Output Structure:')){
                currStructure = 'output';
            } else if (line.startsWith('Input Field:')){
                if (currStructure === 'input') {
                    const field = line.split(':')[1].trim();
                    this.inputFields.push({type: field.split(' ')[0], name: field.split(' ')[1]});
                }
            } else if (line.startsWith('Output Field:')){
                if (currStructure === 'output') {
                    const field = line.split(':')[1].trim();
                    this.outputFields.push({type: field.split(' ')[0], name: field.split(' ')[1]});
                }
            }
        })
    }

    generateCpp(): string {
        console.log(this.inputFields);
        const inputReads = this.inputFields
            .map(field => {
                console.log(field)
                console.log('cpp');
                if (field.type.startsWith('vector<')) {
                    return `int n;\ncin >> n;\n${field.type} ${field.name}(n);\nfor(int i = 0; i < n; i++) {\n    cin >> ${field.name}[i];\n}`;
                }
                return `${field.type} ${field.name};\ncin >> ${field.name};`;
            }).join('\n');

        return `#include <bits/stdc++.h>
using namespace std;

##user_code

int main() {
    ${inputReads}
    ${this.outputFields[0].type} result = ${this.functionName}(${this.inputFields.map(f => f.name).join(', ')});
    cout << result << endl;
    return 0;
}`;
    }

    generatePython(): string {
        return `##user_code
if __name__ == "__main__":
    ${this.inputFields.map(field => {
        if (field.type.startsWith('vector<')) {
            return `n = int(input())\n    ${field.name} = list(map(int, input().split()))`;
        }
        return `${field.name} = int(input())`;
    }).join('\n    ')}
    result = ${this.functionName}(${this.inputFields.map(f => f.name).join(', ')})
    print(result)`;
    }

    generateJavascript(): string {
        const functionDef = `##user_code`;

        const inputHandling = this.inputFields.map(field => {
            if (field.type.startsWith('vector<')) {
                return `const n = parseInt(inputLines[lineIndex++]);
const ${field.name} = [];
for(let i = 0; i < n; i++) {
    ${field.name}.push(parseInt(inputLines[lineIndex++]));
}`;
            }
            return `const ${field.name} = parseInt(inputLines[lineIndex++]);`;
        }).join('\n');

        return `${functionDef}

// Do not modify code below
process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputLines = [];
let lineIndex = 0;

process.stdin.on('data', function(input) {
    inputLines = input.toString().trim().split('\\n');
});

process.stdin.on('end', function() {
    ${inputHandling}
    const result = ${this.functionName}(${this.inputFields.map(f => f.name).join(', ')});
    console.log(result);
});`;
    }
}