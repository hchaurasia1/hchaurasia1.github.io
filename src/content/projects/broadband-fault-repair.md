---
title: "Broadband Fault Repair Workflow"
summary: "Built the end-to-end service-request journey for Airtel broadband faults — from creation through operator assignment, field visit, post-fix verification, and closure — and launched it pan-India."
company: "Airtel Digital"
period: "2021 – 2023"
order: 7
featured: true
tags: ["Workflow Engine", "Field Operations", "State Machine", "Pan-India Scale"]
stack: ["Java", "Spring Boot", "PostgreSQL", "Redis", "RabbitMQ"]
metrics:
  - { label: "SRs/day at launch", value: "~100K" }
  - { label: "coverage", value: "Pan-India" }
  - { label: "scope", value: "End-to-end journey" }
links: []
---

## Problem

When an Airtel customer raises a service request (SR) for their broadband
connection, that request has a whole life ahead of it: it has to be created,
routed, assigned to a field operator, worked on-site, verified once the fix is
claimed, and finally closed. Before this, there wasn't a system owning that
journey end-to-end for the Telemedia (broadband) fault-repair domain.

## Approach

As part of the Telemedia Fault Repair team on AirtelWork — Airtel's in-house
fleet-management platform — I designed and built the Broadband Fault Repair
workflow from scratch. I modelled the SR's full lifecycle as a state machine:
creation → operator assignment → field visit → post-resolution error check →
closure, with each transition driving the next action.

I took it through the full rollout path — UAT, go-to-market, and launch — rather
than throwing it over the wall. Launching nationwide meant it had to hold up
across every circle and operator in the country from day one.

## Outcome

The system launched pan-India and handled around **100K service requests per
day**, becoming the backbone of how broadband faults get resolved across
Airtel's field operations.
