export interface SampleProgram {
  id: string;
  title: string;
  description: string;
  code: string;
}

export const samples: SampleProgram[] = [
  {
    id: "welcome",
    title: "Welcome Loop",
    description: "A simple infinite loop that welcomes you to VC83 BASIC.",
    code: `
10 PRINT "WELCOME TO VC83 BASIC!"
20 GOTO 10
`
  },
  {
    id: "fibonacci",
    title: "Fibonacci Sequence",
    description: "Generates and prints the first 20 numbers in the Fibonacci sequence.",
    code: `
10 A=0:B=1
20 FOR I=1 TO 20
30 PRINT A
40 C=A+B:A=B:B=C
50 NEXT I
`
  },
  {
    id: "primes",
    title: "Prime Numbers",
    description: "A simple algorithm to find and display prime numbers up to 100.",
    code: `
10 FOR N=2 TO 100
20 FOR D=2 TO SQR(N)
30 IF N/D=INT(N/D) THEN POP:GOTO 60
40 NEXT D
50 PRINT N;" ";
60 NEXT N
`
  },
  {
    id: "guess",
    title: "Guess the Number",
    description: "A classic game where you try to guess a random number between 1 and 100.",
    code: `
10 R=INT(RND(1)*100)+1
20 PRINT "GUESS MY NUMBER (1-100)"
30 INPUT G
40 IF G<R THEN PRINT "TOO LOW":GOTO 30
50 IF G>R THEN PRINT "TOO HIGH":GOTO 30
60 PRINT "YOU GOT IT!"
`
  },
  {
    id: "multiplication",
    title: "Multiplication Table",
    description: "Displays a neat 10x10 multiplication table using nested loops.",
    code: `
10 FOR I=1 TO 10
20 FOR J=1 TO 10
30 S$=STR$(I*J):PRINT LEFT$("    ",4-LEN(S$));S$;
40 NEXT J
50 PRINT
60 NEXT I
`
  }
];
