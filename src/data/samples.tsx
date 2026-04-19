import type { ReactNode } from 'react';

export interface SampleProgram {
  id: string;
  title: string;
  description: ReactNode;
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
  },
  {
    id: "factorial",
    title: "Factorial Calculation",
    description: "Calculates the factorial of a number up to 10.",
    code: `
10 INPUT "NUMBER (1-10): ";N
20 F=1
30 FOR I=1 TO N
40 F=F*I
50 NEXT I
60 PRINT N;"! = ";F
`
  },
  {
    id: "baxter",
    title: "Baxter Permutations",
    description: (
      <>
        Calculates the number of Baxter permutations of length N. See <a href="https://oeis.org/A001181">OEIS A001181</a>;
        W. M. Boyce, <a href="https://oeis.org/A001181/a001181_1.pdf">Generation of a class of permutations associated with commuting functions</a>;
        and F. R. K. Chung, et al, <a href="https://doi.org/10.1016/0097-3165(78)90068-7">The Number of Baxter Permutations</a>.
      </>
    ),
    code: `
10 PRINT "BAXTER PERMUTATION CALCULATOR":PRINT "(BOYCE, 1967)"
20 INPUT "N? ";N
30 IF N<1 THEN END
40 M=N+1:S=0
50 FOR K=1 TO N
60 REM GET BINOMIALS FOR K-1, K, AND K+1
70 L=K-1:GOSUB 200:C1=C
80 L=K:GOSUB 200:C2=C
90 L=K+1:GOSUB 200:C3=C
100 S=S+(C1*C2*C3)
110 NEXT K
120 REM APPLY THE FINAL MULTIPLIER 2/(N*(N+1)^2)
130 B=2*S/(N*M*M)
140 PRINT "B(";N;") = ";B
150 PRINT:GOTO 20
160 END
200 REM SUBROUTINE: BINOMIAL (M CHOOSE L)
210 C=1:IF L<0 OR L>M THEN C=0:RETURN
220 IF L=0 OR L=M THEN RETURN
230 IF L>M/2 THEN L=M-L
240 FOR I=1 TO L
250 C=C*(M-I+1)/I
260 NEXT I
270 RETURN
`
  },
  {
    id: "urn",
    title: "Urn Valuation",
    description: (
      <>
        Calculates the maximum expected value of an urn containing M negative and P positive balls
        by determining the optimal stopping strategy for a player trying to maximize their total score.
        See W. M. Boyce, <a href="https://doi.org/10.1016/0012-365X(73)90123-4">On a Simple Optimal Stopping Problem</a>.
      </>
    ),
    code: `
10 PRINT "URN VALUE CALCULATOR":PRINT "(BOYCE, 1973)"
20 INPUT "NUMBER OF MINUS BALLS (M)? ";M
30 INPUT "NUMBER OF PLUS BALLS (P)? ";P
40 DIM V(P)
50 REM INITIAL STATE: 0 MINUS BALLS. VALUE IS THE NUMBER OF PLUS BALLS.
60 FOR J=0 TO P
70 V(J)=J
80 NEXT J
90 REM ITERATE THROUGH MINUS BALLS (I) AND PLUS BALLS (J)
100 FOR I=1 TO M
110 V(0)=0
120 FOR J=1 TO P
130 REM E=PROB(PLUS)*(1+V_NEXT)+PROB(MINUS)*(-1+V_PREV_ROW)
140 E=(J/(I+J))*(1+V(J-1))+(I/(I+J))*(V(J)-1)
150 REM IF EXPECTED VALUE IS NEGATIVE, STOP (VALUE=0)
160 IF E<0 THEN V(J)=0:GOTO 180
170 V(J)=E
180 NEXT J
190 NEXT I
200 PRINT "THE VALUE OF THE (";M;",";P;") URN IS:":PRINT "  ";V(P)
210 CLR:GOTO 20
220 END
`
  }
];

