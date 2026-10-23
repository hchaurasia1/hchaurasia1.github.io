# hchaurasia1.github.io

My personal portfolio — [hchaurasia1.github.io](https://hchaurasia1.github.io).

Built with [Astro](https://astro.build) as a static site and deployed to GitHub
Pages automatically on every push to `main`.

## Local development

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # output to ./dist
```

## Adding a project

Create `src/content/projects/<slug>.md`. The file name becomes the URL
(`/projects/<slug>`).

```md
---
title: "Project title"
summary: "One or two sentences shown on the card."
company: "Flexport"          # optional
period: "2025"               # optional
tags: ["Kafka", "Search"]    # optional, first 4 shown on the card
stack: ["Node.js", "MySQL"]  # optional, shown at the bottom of the page
featured: true               # optional, shows it on the home page
order: 10                    # optional, lower comes first
---

## Problem

...

## Approach

...

## Outcome

...
```

## Adding a blog post

Create `src/content/blog/<slug>.md`:

```md
---
title: "Post title"
description: "One-line summary."
pubDate: 2026-10-23
tags: ["distributed-systems"]  # optional
draft: false                   # optional, true hides it
---

Post body in Markdown.
```

Push to `main` and the site redeploys on its own.
