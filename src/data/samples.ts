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
    code: '10 PRINT "WELCOME TO VC83 BASIC! "\n20 GOTO 10\n'
  },
  {
    id: "fibonacci",
    title: "Fibonacci Sequence",
    description: "Generates and prints the first 20 numbers in the Fibonacci sequence.",
    code: '10 A=0:B=1\n20 FOR I=1 TO 20\n30 PRINT A\n40 C=A+B:A=B:B=C\n50 NEXT I\n'
  },
  {
    id: "primes",
    title: "Prime Numbers",
    description: "A simple algorithm to find and display prime numbers up to 100.",
    code: '10 FOR N=2 TO 100\n20 FOR D=2 TO SQR(N)\n30 IF N/D=INT(N/D) THEN GOTO 60\n40 NEXT D\n50 PRINT N;" ";\n60 NEXT N\n'
  },
  {
    id: "guess",
    title: "Guess the Number",
    description: "A classic game where you try to guess a random number between 1 and 100.",
    code: '10 R=INT(RND(1)*100)+1\n20 PRINT "GUESS MY NUMBER (1-100)"\n30 INPUT G\n40 IF G<R THEN PRINT "TOO LOW":GOTO 30\n50 IF G>R THEN PRINT "TOO HIGH":GOTO 30\n60 PRINT "YOU GOT IT!"\n'
  },
  {
    id: "multiplication",
    title: "Multiplication Table",
    description: "Displays a neat 10x10 multiplication table using nested loops.",
    code: '10 FOR I=1 TO 10\n20 FOR J=1 TO 10\n30 PRINT I*J;CHR$(9);\n40 NEXT J\n50 PRINT\n60 NEXT I\n'
  }
];
