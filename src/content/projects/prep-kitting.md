---
title: "Kitting: Turning Components Into Sellable Units"
summary: "Built the kitting flow where a seller's component inventory is assembled into kit SKUs — the hard part was keeping inventory honest as components turn into kits across two domains."
company: "Flexport"
period: "2024"
order: 5
featured: true
tags: ["Inventory", "Domain Design", "Lot Tracking", "Prep", "System Design"]
stack: ["Node.js", "TypeScript", "MySQL", "Redis", "AWS Lambda"]
---

## Problem

A kit is a SKU made of several component SKUs — a seller sends components and we
assemble them into finished, sellable units. The assembly is manual warehouse
work; the engineering problem is **inventory accounting**. It behaves differently
on each side: for inbound, you can simply receive the finished kit, but for
outbound the components already sit in storage, so you have to subtract the
components and add the kit yourself without ever losing or double-counting units.

## Approach

I modelled kitting as its own step in the prep job, with a subtask per kit SKU
tracking expected vs. completed quantity. The cleaner boundary decision was
keeping the rest of the system kit-agnostic: upstream ordering works purely in
component SKUs, and the conversion from "kit demanded" to "components consumed"
lives in one place rather than leaking into every service.

I also built lot and expiry tracking across the component/kit boundary: component
lot and expiry are recorded per job, and a **kit's expiry is computed as the
earliest expiry among its components** — a kit is only as fresh as its
shortest-lived ingredient. Some rules fell out of the domain and were worth
enforcing explicitly: a kit can't be built from another kit, and once a SKU is
marked as a kit it can't be un-kitted.

## Outcome

Sellers' components get assembled into kits with inventory tracked correctly
across the inbound and outbound domains, and with lot/expiry carried through the
transformation rather than lost at the point components become a kit.
