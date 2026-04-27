---
title: The Duck Protocol
section: 2
---

# The Duck Protocol

In practice, the protocol takes one of two postures.

The first is **line-by-line explanation**. The programmer reads each line of
the relevant function aloud — not just the code, but what it does. *"This
function takes a list of users. For each user, it checks whether their
account is active. If it's active, it adds them to the email queue."* The
explanation is targeted at the duck but designed for the programmer's own
ear. Bugs surface in the gap between what the code says and what the
programmer is saying it says.

The second is **goal-explanation**. The programmer steps back and explains
the *intent* — what the function is trying to accomplish, and why this
function is being written at all. *"I'm trying to send a welcome email to
new users, but only if they've completed onboarding within the last 24
hours, and only if they haven't already received one."* Bugs surface when
the programmer realizes that the goal as stated does not match the design
they have built around it.

Both postures share the load-bearing element: articulation. [@naur1985programming]
frames programming itself as theory-building — the program is an externalized
trace of the programmer's evolving theory of the problem domain. The bug,
in this frame, is a place where the theory has drifted from its
externalization. Articulation makes the theory inspectable; the duck is
present mostly to give the articulation a direction.

Conditions under which the duck helps:

- The programmer is working alone and cannot interrupt a colleague.
- The bug has resisted single-pass code review.
- The programmer suspects the issue is in their own model, not in a
  dependency or environment.
- There is enough quiet to explain aloud.

Conditions under which the duck doesn't help:

- The bug is in a system whose behavior the programmer has never observed
  directly. Articulation cannot surface what was never internalized.
- The programmer is fatigued past the point where articulation produces
  more signal than noise. [@brooks1995mythical] notes a similar pattern in
  multi-day debugging sessions: the social dynamics of programming work
  break down when the programmer's reservoir of attention is drained.
- The bug is in another author's code that the current programmer has not
  yet read carefully.

Pair programming and code review accomplish the same articulation work with
a more demanding audience. The duck is the minimum viable case of that same
posture.
