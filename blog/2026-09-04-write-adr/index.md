---
title: "The ADR Nobody Wanted to Read"
authors: [shpendkelmendi]
tags: [architecture, governance, well-architected-framework, Data-Platform, ai]
description: "How teams make decisions in a page and a half and how AI agents can help."
keywords: [architecture decision records, adr, architecture decisions, team collaboration, arc42, ai agents, well-architected-framework, Data-Platform]
image: ./images/cover.png
---

*How Teams Make Decisions in a Page and a Half and How AI Agents Can Help*

## Tom’s 12-Page ADR

Tom is an engineer on the Data Platform team. Today, he’s writing his first ADR. The team needs to decide whether its Terraform code goes into a monorepo or into multiple repos. Tom wants to get it right, so he includes everything: the system design, discussions from three meetings, comparison tables, diagrams, risks, and a migration plan.

The result is twelve pages. Nobody reads it. Two colleagues skim the first page, one comments on a detail in the appendix, and the decision is still up in the air. Three weeks later, someone asks in the daily stand-up, “Did we actually decide this?”

I know this situation well: I’ve packed ADRs with details myself and tried to discuss, design, and decide in one document at the same time. It doesn’t work. In this post, I’ll show you a better way: how an entire team can write ADRs, and where AI agents can help.

<!-- truncate -->

---

## What is an ADR?

An Architecture Decision Record, or ADR, captures one important decision:

- **Title:** A running number plus the decision itself, for example “ADR0007: Use a monorepo for Terraform”
- **Context:** What are the drivers for this decision?
- **Considered Options:** Two to four genuine alternatives, each with a brief, honest assessment of its pros and cons
- **Decision:** Which option, in one sentence
- **Consequences:** What follows from it, including the unpleasant parts

Nothing more.

But when do you need one? The Continuous Architecture platform offers a simple rule of thumb: a decision needs an ADR when the cost of changing it or reworking it will be high.

Here’s an example from a data platform: should the Terraform code live in a monorepo or in multiple repositories? A monorepo keeps all layers and teams in one repository, while a multirepo setup splits them up, for example, one repository per team. The choice affects ownership, access control, release cadence, and how state files are organized. Changing it later would be expensive, so it’s a clear case for an ADR. The ADR collection also has a [monorepo vs multirepo example](https://github.com/architecture-decision-record/architecture-decision-record/blob/main/locales/en-001/examples/monorepo-vs-multirepo) (not data platform related).

By contrast, decisions that can be corrected in minutes don’t need an ADR:

- the notebook folder structure
- the cluster size for a single job
- the schedule for a single job, such as 6 instead of 7 a.m.

## Decision-making instead of decision-finding

This is the heart of the matter, and where Tom stumbled: An ADR is a document for recording a decision, not for making one.

A good ADR fits on one to one and a half pages.

What doesn’t belong: A complete system design, discussion transcripts, or implementation details.

If a topic needs more discussion, have that discussion first. Tom could have scheduled a one-hour session with the team to talk through the options on a whiteboard. Then he could write the ADR, which would simply summarize the outcome. If the details are still important, put them in an appendix or on a linked page. The ADR stays readable, and none of the depth is lost.

## The Process in the Team

Tom isn’t an architect, and that’s the point. ADRs shouldn’t be written only by architects, but by anyone on the team preparing a relevant decision.

Andrew Harmel-Law makes a strong case for this in an [article on Martin Fowler’s site](https://martinfowler.com/articles/scaling-architecture-conversationally.html). His starting point echoes Alberto Brandolini, the inventor of Event Storming: It’s the developers’ assumptions that ship, not the lead architect’s diagram. Therefore, the architecture that matters most is the one in the heads of the people writing the code.

Handing those people a document with the solution doesn’t fix that. Conversation does. It clears up misunderstandings, and it often leads to better solutions. That’s why conversation is the core of his approach. Don't be afraid of naysayers. It's better to have people in the conversation who can challenge the solution, rather than just agree to each point. This helps teams to decide for themselves instead of waiting for a few people to hand down decisions, but they have to seek advice from those affected and from those with relevant expertise. This is the Advice Process by Andrew Harmel-Law.

It helps not to take the word architecture too literally. According to the [MADR-Project](https://github.com/sdiachen/madr), any decision that could affect the architecture is an architectural decision. Some teams also prefer to talk about decisions rather than ADRs. For a team where everyone is expected to document decisions, this lowers the barrier to doing so.

Regarding cadence: ADRs are created on demand. It can still be helpful to set aside a regular time slot, for example, during the weekly alignment meeting to briefly approve any open ADRs.

One more thing: Old ADRs are never deleted or rewritten. If circumstances change, write a new ADR, mark the old one as superseded, and link the two.

## ADR and arc42

How does this fit with architecture documentation, such as arc42?

The difference is the timeline. An ADR documents a decision about a desired state: We want to do X, and these are the reasons. The views in arc42 - the building block view, deployment view, and cross-cutting concepts - describe the current state.

This leads to a clear division of responsibilities:

- Chapter 9 of arc42, Architecture Decisions, links to the ADRs.
- Chapter 4, Solution Strategy, briefly summarizes the most important guiding decisions.
- Once a decision has been implemented, its outcome is reflected in the relevant views or solution strategy.

## ADRs and AI Agents

A short, structured format works well with AI agents. What matters, though, is how you use them: The agent helps with wording, structure, and validation. The team remains responsible for the thinking and the decision.

**Wording and structure:** The team brings the substance: options, arguments, and the decision. The agent puts it into the template, trims it to meet the page limit, and smooths out the language. Tom checks whether the text accurately reflects what the team discussed.

**Validation:** The agent checks the draft against the team’s rules: one decision per ADR, length, genuine alternatives, honest consequences, and too much design detail in the text.

**Cross-validation:** The agent knows all the existing ADRs in the repository and the arc42 documentation. It finds conflicting or outdated decisions and shows which views, quality goals, or cross-cutting concepts a new decision affects.

**Maintenance:** An agent can detect when code or infrastructure deviates from an accepted ADR and alert the team. That’s when it’s time for a new ADR or a code correction.

**Skills from the repo:** The [ADR collection repository](https://github.com/architecture-decision-record/architecture-decision-record#claude-code-skills-for-adrs) includes two Claude Code skills. The architecture-decision-record-skill is the one teams may find useful. It helps determine whether a decision needs an ADR at all, selects one of eleven included templates, and assists with writing the Context, Decision, and Consequences sections.

**Warning:** Don’t have an agent create everything. If the agent gathers options, weighs the arguments, and delivers the decision too, you end up with paperwork instead of understanding. Decision records are worthless if they’re just a box-checking exercise imposed after the fact. They should spark a conversation about why. An agent also knows only the context you give it, and it can sound convincing even when its reasoning doesn’t fit your situation. So the rule is: The team thinks, discusses, and decides. The agent helps with wording, structure, review, and cross-checking.

## Conclusion

Anyone on the team can and should write ADRs, not just architects. Like Tom, they don’t need to have all the answers before starting a conversation.

Taking a decision is not the same as the decision-making process. The most important part is the exchange: discussing alternatives, challenging assumptions, and learning from the people affected. The ADR is just one part of the outcome: a concise record of what the team decided and why.

AI agents can help turn the team’s input into a clear record and check it against existing decisions. But they should not take over the thinking or make the decision. That responsibility stays with the team.

## Further reading

- [Martin Fowler, Architecture Decision Record](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html)
- [Andrew Harmel-Law, Scaling the Practice of Architecture, Conversationally](https://martinfowler.com/articles/scaling-architecture-conversationally.html)
- [Continuous Architecture, Architecture Decision Records](https://continuous-architecture.org/practices/architecture-decision-records)
- [Olaf Zimmermann, ADR = Any Decision Record?](https://www.ozimmer.ch/practices/2021/04/23/AnyDecisionRecords.html)
- [AWS Prescriptive Guidance, Using architectural decision records to streamline decision-making](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html)
- [MADR, Markdown Architectural Decision Records](https://github.com/sdiachen/madr)
- [ADR collection with templates, teamwork tips, and Claude Code skills](https://github.com/architecture-decision-record/architecture-decision-record)
