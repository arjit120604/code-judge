import { cppToPythonType, cppToJavaScriptType, cppToJavaType } from './types/TypeMappings';

export default class ProblemDefinitionGenerator {
    problemName: string = "";
    functionName: string = "";
    inputFields: { type: string; name: string; }[] = [];
    outputFields: { type: string; name: string; }[] = [];

    parse(input: string) {
        const lines = input.split('\n').map(line => line.trim());

        let curr: string | null = null; 

        lines.forEach(line => {
            if (line.startsWith('Problem Name:')){
                this.problemName = line.split(':')[1].trim();
            } else if (line.startsWith('Function Name:')){
                this.functionName = line.split(':')[1].trim();
            } else if (line.startsWith('Input Structure:')){
                curr = 'input';
            } else if (line.startsWith('Output Structure:')){
                curr = 'output';
            } else if (line.startsWith('Input Field:')){
                if (curr === 'input') {
                    const field = line.split(':')[1].trim();
                    this.inputFields.push({type: field.split(' ')[0], name: field.split(' ')[1]});
                }
            } else if (line.startsWith('Output Field:')){
                if (curr === 'output') {
                    const field = line.split(':')[1].trim();
                    this.outputFields.push({type: field.split(' ')[0], name: field.split(' ')[1]});
                }
            }
        });
    }

    generateCpp(): string {
        const inputFields = this.inputFields
            .map(field => `${field.type} ${field.name}`).join(', ');
        const outputType = this.outputFields[0].type;
        return `${outputType} ${this.functionName}(${inputFields}) {
    // Write your code here
    return result;
}`;
    }

    generatePython(): string {
        const inputFields = this.inputFields
            .map(field => {
                const pythonType = cppToPythonType[field.type] || 'Any';
                return `${field.name}: ${pythonType}`;
            }).join(', ');
        const returnType = cppToPythonType[this.outputFields[0].type] || 'Any';
        
        return `def ${this.functionName}(${inputFields}) -> ${returnType}:
    # Write your code here
    return result`;
    }

    generateJava(): string {
        const inputFields = this.inputFields
            .map(field => {
                const javaType = cppToJavaType[field.type] || 'Object';
                return `${javaType} ${field.name}`;
            }).join(', ');
        const returnType = cppToJavaType[this.outputFields[0].type] || 'Object';
        
        return `public ${returnType} ${this.functionName}(${inputFields}) {
    // Write your code here
    return result;
}`;
    }

    generateJavascript(): string {
        const inputFields = this.inputFields
            .map(field => field.name).join(', ');
        const returnType = cppToJavaScriptType[this.outputFields[0].type] || 'any';
        
        return `/**
 * @param {${inputFields.split(', ').map(param => `${param}: ${cppToJavaScriptType[this.inputFields.find(f => f.name === param)?.type || ''] || 'any'}`).join('\n * @param ')}
 * @returns {${returnType}}
 */
function ${this.functionName}(${inputFields}) {
    // Write your code here
    return result;
}`;
    }
}