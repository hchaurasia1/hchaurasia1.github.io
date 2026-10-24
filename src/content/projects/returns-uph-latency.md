---
title: "Taking the warehouse off the critical path"
summary: "Returns inspection was blocked on a slow, synchronous call to the warehouse system. I made those updates asynchronous and self-reconciling, which roughly doubled warehouse throughput."
company: "Flexport"
order: 1
stack: ["Node.js", "TypeScript", "MySQL", "AWS Lambda", "SNS", "SQS", "CDC", "Datadog"]
---

## Problem

When an operator inspects a return and moves the item to a new location, the
Returns service told the warehouse management system (WMS) about that move
**synchronously** — the operator's action didn't complete until the WMS call
came back. That call had a p95 of ~7–8 seconds, so operators spent much of their
day waiting on an external system before they could pick up the next item. With
~10K items inspected daily, that wait was the single biggest drag on UPH (units
processed per hour).

Worse, synchronous coupling created stuck states: if the WMS call timed out but
the move had actually succeeded, the two systems disagreed and only manual
intervention could fix it.

## Approach

I moved the WMS updates off the critical path and made them reconcile
themselves. Each item movement is recorded locally with a sync status
(created → sent → synced), and changes flow through a CDC pipeline into AWS
Lambda workers over SNS/SQS. One worker picks up new movements and sends them to
the WMS; a second listens to the WMS's own movement events to confirm each one
actually landed. A scheduled cron retries anything stuck, with a retry cap so
genuinely-failed cases get flagged instead of looping forever. To identify items
reliably even if they're moved directly in the WMS, each return item gets its own
license plate that travels with it.

## Outcome

Operators no longer wait on the warehouse to finish an inspection — the update
happens in the background and the system heals itself when the WMS is slow or
flaky. Throughput rose from roughly 21 to 32 items per operator-hour, and a
whole class of manual "systems out of sync" tickets went away.
