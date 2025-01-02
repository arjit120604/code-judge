##user_code

// Do not modify code below
process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputLines = [];
let lineIndex = 0;

process.stdin.on('data', function(input) {
    inputLines = input.toString().trim().split('\n');
});

process.stdin.on('end', function() {
    const n = parseInt(inputLines[lineIndex++]);
const arr = [];
for(let i = 0; i < n; i++) {
    arr.push(parseInt(inputLines[lineIndex++]));
}
const n = parseInt(inputLines[lineIndex++]);
const brr = [];
for(let i = 0; i < n; i++) {
    brr.push(parseInt(inputLines[lineIndex++]));
}
    const result = maxElement(arr, brr);
    console.log(result);
});