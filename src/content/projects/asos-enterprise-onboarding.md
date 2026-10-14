---
title: "Onboarding an Enterprise Returns Merchant"
summary: "A large apparel merchant needed returns handled differently from everyone else — item-level inventory tracking and their own batched notification feed. I built the integration that made it work."
company: "Flexport"
period: "2024"
order: 2
featured: true
tags: ["Integrations", "Batch Sync", "CDC Events", "Inventory", "Warehouse Ops"]
stack: ["Node.js", "TypeScript", "MySQL", "AWS Lambda", "SNS", "SQS", "CDC"]
metrics:
  - { label: "notification cadence", value: "every 5 min" }
  - { label: "query cost cut", value: "~200 → ~3" }
  - { label: "item throughput", value: "~6–8K items/day" }
links: []
---

## Problem

Most merchants' returns are only reported to the warehouse once an item is fully
processed. This enterprise merchant needed the opposite: item-level inventory
tracking from the moment inspection begins — through salvage, rework, and
putaway, including items being returned to them or destroyed. They also consumed
updates through their own notification API on a fixed schedule, not our standard
event stream.

## Approach

I built two integration surfaces. For notifications, a job runs every five
minutes, finds the return items that changed since the last successful run, and
posts them to the merchant's batch API. The "changed since" query was expensive,
so I added a composite index that cut its cost from ~200 to ~3. When update
volumes spiked, I switched from large five-minute batches to smaller, more
frequent ones.

For status, instead of publishing inline (which would add latency to every
write), I emitted a single status-changed event off the existing
change-data-capture stream, routed to both the merchant and the billing/inventory
consumers. For inventory, each inspected item gets its own license plate and is
tracked directly through the warehouse via asynchronous, self-reconciling moves.

## Outcome

The merchant onboarded onto a flow built for their requirements, handling roughly
6–8K items a day with inventory tracked end-to-end and updates delivered on their
schedule.
