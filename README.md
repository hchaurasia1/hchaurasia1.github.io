# hchaurasia1.github.io

My personal portfolio — [hchaurasia1.github.io](https://hchaurasia1.github.io).

Built with [Astro](https://astro.build) as a static site and deployed to GitHub
Pages automatically whenever a PR is merged into `main`.

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
summary: "One or two sentences shown in the project list."
company: "Flexport"          # optional, shown next to the title
stack: ["Node.js", "MySQL"]  # optional, shown at the bottom of the page
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
draft: false        # optional, true hides it
---

Post body in Markdown.
```

Open a PR, merge it into `main`, and the site redeploys on its own.
