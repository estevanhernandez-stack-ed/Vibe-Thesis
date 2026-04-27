# 06_REVIEW_RESPONSES

Structured tracking of peer review cycles. One subdirectory per review round.

## Pattern

```text
06_REVIEW_RESPONSES/
├── round-01/
│   └── reviewers.md
├── round-02/
│   └── reviewers.md
└── ...
```

Each `reviewers.md` follows the structure shown in `round-01/reviewers.md.template` — every reviewer comment quoted, your structured response written, and the change-location referenced (file + line range).

## Why structured

Journals expect a response letter that addresses each reviewer comment individually. By structuring the response as you make changes, the response letter writes itself. A render command (planned for v1.1) extracts a journal-ready response letter from the structured tracker.

## Comments that don't require changes

Supported. Response = "We thank the reviewer for this observation. No change made because [reasoning]."

## Multi-reviewer rounds

Each reviewer gets their own section in `reviewers.md`. The convention is to label them Reviewer 1, Reviewer 2, etc. — matching the journal's labeling.
