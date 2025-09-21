# Interview Exercise README

Use this template for coding interviews. Copy it into a problem folder under `problems/` and customize the bracketed sections.

## Overview

- Role: [Frontend | Backend | Full‑stack]
- Timebox: [60–75] minutes total
- Primary task: [e.g., Implement Level 1–2 of futureReadingListM]
- Stretch goal: [optional]

## Environment

- Language/Runtime: [Node LTS | Python 3.11 | …]
- Package manager: [npm | yarn | pnpm]
- Commands:
  - Install: `npm install`
  - Run app: `npm start` [if applicable]
  - Run all tests: `npm test` or `bash run_all_tests.sh`
  - Run a single test: `bash run_single_test.sh "<test_case_name>"` [if provided]

## What To Build

Summarize the specific levels/requirements the candidate should aim for:

- Level 1: [one‑line summary]
- Level 2: [one‑line summary]
- Level 3 (stretch): [one‑line summary]

Link to the full problem statement file: `[relative/path/to/Problem.md]`

## Constraints & Tips

- Preserve provided HTML/CSS selectors in templates; tests query by selectors.
- Keep changes focused; prefer small, cohesive functions and clear naming.
- Commit in small increments (if using git) and narrate decisions as you work.
- Assume no external network access unless stated; avoid adding heavy deps.
- For UI: prefer controlled inputs, predictable state updates, and idempotent rendering.
- For backend: model state explicitly; handle invalid inputs gracefully.

## Acceptance Criteria

State the observable outcomes the reviewer can verify (tie to tests when possible):

- [Example] Displays list/cards based on given JSON data.
- [Example] Adding an item via form updates the UI and data source.
- [Example] Items render in correct order and format.

## Evaluation Rubric (1–5)

- Correctness: Meets acceptance criteria; passes tests for target levels.
- Design & Clarity: Readable, maintainable structure; minimal unnecessary complexity.
- Edge Cases & Robustness: Handles invalid inputs and boundary states.
- Testing & Verification: Uses or adds targeted tests where appropriate.
- Communication: Explains approach and trade‑offs during/after implementation.

## How To Run Locally

1. Ensure [Node LTS] installed: `node -v`
2. Install dependencies: `npm install`
3. Start app/tests: `npm start` or `npm test`
4. If something fails to start, capture the error message and proceed with tests or coding the core logic in isolation.

## Submission

- Provide a short summary (3–5 bullets): what you built, trade‑offs, next steps.
- Include instructions for running/verifying if different from above.
- If time remains, note what you would improve and why.

## Optional Discussion Prompts

- What tests would you add next and why?
- How would you extend this (pagination, API errors, RBAC, etc.)?
- Where are potential performance bottlenecks?
