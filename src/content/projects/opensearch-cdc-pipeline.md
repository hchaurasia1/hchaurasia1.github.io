---
title: "Moving returns search off the database"
summary: "Listing and search ran straight against the primary database and couldn't do the partial-match, multi-field search the UI needed. I moved it to a search index kept in sync by change-data-capture."
company: "Flexport"
order: 4
stack: ["Node.js", "TypeScript", "MySQL", "Maxwell's Daemon", "OpenSearch", "Kinesis", "AWS Lambda", "SNS", "SQS"]
---

## Problem

The returns listing and search screens queried the primary database directly.
That worked for exact lookups but not for what the UI actually needed: partial
text matching across fields like RMA, tracking code, order ID, and customer
name, combined with exact filters on status and type — spanning several related
tables. A relational store isn't built for that, and the search load was landing
on the same database serving writes.

## Approach

I moved search onto a dedicated OpenSearch index. The key decision was how to
keep it in sync: writing to the index inside the database transaction would have
added latency and failure modes to every write, so I used change-data-capture
instead. Row changes are captured off the MySQL binlog by Maxwell's Daemon, carried on a
Kinesis stream into a Lambda that filters for the records search cares about,
then fanned out through SNS to an SQS queue where a second Lambda builds the
OpenSearch document and writes it — fully decoupled from the write path.

A few things I was deliberate about: the index mappings are strict, so an
unexpected new column is rejected rather than silently mis-indexed; the write
code tolerates schema changes without breaking; deleted/destroyed records are
filtered out instead of being indexed; and the initial backfill ran per-seller,
starting with a test seller and only widening once data was flowing correctly.

## Outcome

Search and listing moved onto an index purpose-built for them, staying in sync
automatically through CDC, with read load taken off the transactional database.
