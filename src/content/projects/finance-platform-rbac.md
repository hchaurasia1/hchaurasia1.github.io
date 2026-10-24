---
title: "Access control and approvals for a finance platform"
summary: "Built the roles-and-permissions system and approval routing for an in-house finance platform that replaced a third-party procurement tool, saving $500K in licence fees."
company: "Flexport"
order: 6
stack: ["TypeScript", "Node.js", "tRPC", "PostgreSQL", "React"]
---

## Problem

We were replacing a third-party procurement tool, which cost $500K in licence
fees, with an in-house finance platform. That tool's whole model is built around
roles, permissions and approval chains, so the replacement needed an equivalent
from day one. The data it guards is sensitive: vendor payment details, bills and
payments, virtual cards, agreements, and approval workflows. Every route and
record needed to check "is this user actually allowed to do this?"

## Approach

I modelled it as users, permission groups, and permissions, named by a
`resource:subresource:action` convention. Permissions load once per request in
middleware and attach to the request context, so each API route can assert what
it needs. I chose reading from the database per request over baking permissions
into the auth token — tokens go stale until the next login, and we'd already been
bitten by token-size limits elsewhere.

Enforcement works at two levels: a group-level check for broad access, and a
record-level fallback so someone can still act on a specific item if they're its
requester, assignee, or approver. I also gated routes family by family, pairing
each backend check with a matching frontend guard.

Approvals are graph problems, so I used graph traversal for them. When someone
creates an approval workflow for purchase requests, the platform runs cycle
detection so a workflow can never loop back on itself. When a purchase request
comes in, it walks the approval hierarchy to work out who should be assigned,
based on each approver's limit.

## Outcome

The platform replaced the third-party tool and saved $500K in licence fees. It
launched with access control enforced on every sensitive route and record, FE
and BE permission checks kept in sync by tests, and purchase requests routed to
the right approver automatically.
