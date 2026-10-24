---
title: "Smart SR journey"
summary: "Stopped Airtel from sending field engineers to individual homes for area-wide network outages — automatically generating and holding affected SRs, then re-checking each connection once the upstream fix landed."
company: "Airtel Digital"
order: 8
stack: ["Java", "Spring Boot", "PostgreSQL", "Redis", "RabbitMQ", "Solace"]
---

## Problem

The default fault-repair flow sends a field operator to the customer's home to
diagnose every service request. That's the right call for a single faulty
connection — but when an outage hits a whole area, the fault is upstream, not in
anyone's house. Dispatching an engineer to each affected customer is pure waste:
hundreds of pointless home visits for one upstream problem.

## Approach

I built a system to catch and short-circuit area-wide outages. When a network SR
is raised for an area, it automatically generates SRs for every affected
connection and moves any already-raised SRs in that area into a **HOLD** state —
so no engineer gets dispatched while the real fix is happening upstream.

Once the wide-area issue is resolved, my system receives a notification and runs
**EDT** (Error Diagnostic Tool — a latent third-party API) to check each
connection individually. Connections that are now healthy get their SRs closed
automatically. Only the ones *still* broken get assigned to a field engineer,
scheduled by slot availability, so a technician visits a home only when there's
genuinely something there to fix.

## Outcome

The system handled around **500K SRs per day**, eliminated the wave of
unnecessary home visits that area outages used to trigger, and delivered roughly
**₹150 Cr (~$18M)** in annual savings for Airtel.
