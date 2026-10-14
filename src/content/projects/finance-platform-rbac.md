---
title: "Access Control for a Finance Platform"
summary: "Built the roles-and-permissions system for an in-house finance platform from scratch — including the row-level access rules and a fix for a privilege-escalation hole I found along the way."
company: "Flexport"
period: "2024 – 2025"
order: 6
featured: true
tags: ["Access Control", "RBAC", "Security", "tRPC", "System Design"]
stack: ["TypeScript", "Node.js", "tRPC", "PostgreSQL", "React"]
metrics:
  - { label: "model", value: "Groups + permissions" }
  - { label: "enforcement", value: "Route + record level" }
  - { label: "security fix", value: "Privilege escalation closed" }
links: []
---

## Problem

We were replacing a third-party finance tool with an in-house platform, and that
tool's whole model is built around roles and permissions — so the replacement
needed an equivalent from day one. The data it guards is sensitive: vendor
payment details, bills and payments, virtual cards, agreements, and approval
workflows. Every route and record needed to check "is this user actually allowed
to do this?"

## Approach

I modelled it as users, permission groups, and permissions, named by a
`resource:subresource:action` convention. Permissions load once per request in
middleware and attach to the request context, so each API route can assert what
it needs. I chose reading from the database per request over baking permissions
into the auth token — tokens go stale until the next login, and we'd already been
bitten by token-size limits elsewhere.

Enforcement works at two levels: a group-level check for broad access, and a
record-level fallback so someone can still act on a specific item if they're its
requester, assignee, or approver. I also gated routes family by family — pairing
each backend check with a matching frontend guard — and caught a
**privilege-escalation bug** where an admin-bypass permission could be granted by
users who shouldn't have had it, which I closed by moving admin to a protected
account property.

## Outcome

The platform launched with access control enforced on every sensitive route and
record, FE and BE permission checks kept in sync by tests, and a real
self-escalation vulnerability removed before it could be exploited.
