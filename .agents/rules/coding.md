---
trigger: always_on
---

# Coding

## Authorized Changes

Code changes must be authorized.

I will authorize you to make code changes by using imperative verbs like "implement" or "refactor" or "fix," or by using phrases like "make this do that" or "add this new feature" or "improve the algorithm." If I only ask a question, like "why is this happening?" or "why did you do this?" then just answer my question and let me decide what to do. If you're not sure if I want you to make changes or not, ask me.

Before making any change, ask yourself: "Did the user authorize me to make this change? [Yes/No]." If your answer is No, explain what you want to change, then wait for authorization before proceeding.

Focus on the minimum set of changes necessary to meet your objective. Don't make other unrelated changes or refactoring. If I ask you to change a module, or a function, only change that module or function. If I want you to change other things, I will say something like "update other modules to match." Let me know if you notice anything that you think should be changed and let me decide whether to do it or not.

## Keep Unrecognized Changes

If you see that I've made changes to the code, keep them. If you think my changes are wrong, ask me before removing them.

## Wait/Stop

If I say "wait," or "stop," immediately stop everything you are doing and await instructions.

## Scratch Space

Use your own scratch space for test scripts, output logs, random data files, etc. Don't put them in the project directory where they might be accidentally checked into source control.

## Simplicity and Fail Fast

Write simple, direct code that works as intended or fails immediately and loudly when something unexpected occurs. Do NOT add defensive complexity, optionality, or "fallbacks" to try to cope with unexpected conditions or allow the build, tests, or code to keep running in a broken state.

Specifically, NEVER:

1. Search multiple candidate paths or reach into other projects for missing files, assets, or dependencies. Use a single canonical path and fail immediately if it is missing or invalid.
2. Synthesize dummy, blank, or default data/files (such as blank fonts, default images, empty `.mem` files, or fallback stubs) when a required tool or input file is missing.
3. Add workarounds in production code (such as duplicate/legacy register addresses, fallback state initialization, or silent clamping of invalid state) to make broken or incomplete tests pass. Fix the test or fix the bug.
4. Swallow errors in builds, tools, tests, or runtime code (such as `|| true`, `2>/dev/null`, bare `except: pass`, ignoring error flags/return values, or falling back to stale artifacts when generation fails). Always include `.DELETE_ON_ERROR:` in Makefiles and exit non-zero on any failure.

## Coding Style

The coding style is consistent throughout the code base. Follow this style.

Retain all existing comments and line spacing unless you are actually changing the code in a way that makes the existing comments and line spacing no longer valid or appropriate.

## Remember to Use Git

Use Git commands like `git mv` and `git rm` instead of just `mv` and `rm`.
