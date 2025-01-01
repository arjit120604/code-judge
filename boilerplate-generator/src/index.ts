import fs from 'fs';
import path from 'path';
import ProblemDefinitionGenerator from './ProblemDefinitionGenerator';
import FullProblemDefinitionGenerator from './FullProblemDefinitionGenerator';

function generatePartialBoilerPlate(generatorFilePath: string){
    const inputFilePath = path.join(__dirname, generatorFilePath, 'structure.txt');
    const boilerPlatePath = path.join(__dirname, generatorFilePath, 'boilerplate');

    const input = fs.readFileSync(inputFilePath, 'utf-8');

    const generator = new ProblemDefinitionGenerator();
    generator.parse(input);


    const cppBoilerPlate = generator.generateCpp();
    const pythonBoilerPlate = generator.generatePython();
    const javaBoilerPlate = generator.generateJava();
    const javascriptBoilerPlate = generator.generateJavascript();

    if (!fs.existsSync(boilerPlatePath)){
        fs.mkdirSync(boilerPlatePath, {recursive: true});
    }

    fs.writeFileSync(path.join(boilerPlatePath, 'function.cpp'), cppBoilerPlate);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.py'), pythonBoilerPlate);
    fs.writeFileSync(path.join(boilerPlatePath, 'Function.java'), javaBoilerPlate);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.js'), javascriptBoilerPlate);

    console.log('Boilerplate generated successfully');
}
function generateFullBoilerPlate(generatorFilePath: string){
    const inputFilePath = path.join(__dirname, generatorFilePath, 'structure.txt');
    const boilerPlatePath = path.join(__dirname, generatorFilePath, 'full-boilerplate');

    const input = fs.readFileSync(inputFilePath, 'utf-8');

    const generator = new FullProblemDefinitionGenerator();
    generator.parse(input);

    const cppBoilerPlate = generator.generateCpp();
    const pythonBoilerPlate = generator.generatePython();
    const javascriptBoilerPlate = generator.generateJavascript();

    if (!fs.existsSync(boilerPlatePath)){
        fs.mkdirSync(boilerPlatePath, {recursive: true});
    }

    fs.writeFileSync(path.join(boilerPlatePath, 'function.cpp'), cppBoilerPlate);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.py'), pythonBoilerPlate);
    fs.writeFileSync(path.join(boilerPlatePath, 'function.js'), javascriptBoilerPlate);

    console.log('Boilerplate generated successfully');
}
generateFullBoilerPlate(process.env.GENERATOR_PATH || '');
generatePartialBoilerPlate(process.env.GENERATOR_PATH || '');