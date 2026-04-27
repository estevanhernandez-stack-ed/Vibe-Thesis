# Fixture — Peer Review Cycle

Demonstrates a filled-in peer review response document. Shows the structure expected by the response-letter pattern: each reviewer comment quoted verbatim, structured response, change-location reference (or explicit "no change because").

## What's here

```text
peer-review-cycle/
├── 06_REVIEW_RESPONSES/
│   └── round-01/
│       └── reviewers.md      ← filled-in example with 3 reviewers, 7 comments
└── README.md
```

## What it demonstrates

- The `reviewer.comment-number` numbering convention (`1.1`, `1.2`, `2.1`, etc.)
- Verbatim quotation of reviewer comments
- Concise responses with explicit change-location references
- "No change made" responses with reasoning (not silent dismissal)
- A summary-of-changes paragraph for the editor at the top

## Inspection

Open `reviewers.md`. Notice:

- Each reviewer comment is in a `>` block-quote — verbatim, not paraphrased
- Each response ends with a "Change made" line (or "No change made because...")
- The structure makes the response letter mechanically extractable (planned `npm run render:response-letter` for v1.1)

## Use in your work

When you receive reviewer comments:

1. Copy `reviewers.md.template` from `06_REVIEW_RESPONSES/round-01/` (in the parent repo) to your own `round-NN/reviewers.md`
2. Paste each reviewer comment verbatim into the appropriate `### Comment N.M` slot
3. Write your response. Make the change in the body markdown. Note the location in the "Change made" line.
4. When complete, the document is your response letter (with light reformatting for the journal's submission system)
