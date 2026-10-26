---
title: "How I set up Qwen on my Mac to code for free"
description: "A coding agent on a 16 GB M1 Pro with no API key: Conductor, OpenCode, Ollama and Qwen, and the numbers I measured on the way."
pubDate: 2026-10-26
---

I wanted a coding agent on my personal laptop without paying for a model. The
laptop is a MacBook Pro with an M1 Pro and 16 GB of memory, which is about
the floor for this. The setup took an afternoon, most of it spent finding
out which knobs actually do something. This is what I ended up with and what
I measured.

## The pieces

Four tools, each doing one job:

- **Conductor** is a Mac app that gives every task its own git worktree and
  branch, shows the diff, and opens the pull request. It runs a coding agent
  of your choice inside each workspace and does not bill for the model.
- **OpenCode** is the agent. Conductor bundles it. It turns a model into
  something that can read files, edit them and run commands.
- **Ollama** runs the model on the laptop and serves it on
  `localhost:11434` with the same HTTP shape as the OpenAI and Anthropic
  APIs, so OpenCode talks to it as if it were a cloud provider.
- **Qwen3.5 9B** is the model, Alibaba's open-weight release. It supports
  tool calls, which an agent cannot work without, and it is about 7 GB on
  disk.

Nothing in that chain costs money and nothing leaves the machine.

## What fits in 16 GB

On Apple Silicon the GPU uses the same memory as everything else, so the
model, its context window, macOS and Conductor all share the 16 GB. In
practice the model gets 10 to 11 GB. That rules out the obvious candidates:
the coding-tuned Qwen3-Coder is 19 GB and OpenAI's gpt-oss 20B is 14 GB.
The 9B model at ~7 GB was the strongest one that left room to breathe.

The other half of the budget is the context window, the amount of text the
model holds at once. Ollama defaults to 4,096 tokens on machines with less
than 24 GB, which is roughly one medium source file. An agent needs far
more. I expected the window to be the thing that broke the memory budget, so
I measured it at three sizes:

| Context window | Memory for model + context | Placement |
|---|---|---|
| 32k | 8.1 GB | 100% GPU |
| 64k | 8.2 GB | 100% GPU |
| 256k | 8.2 GB | 100% GPU |

The second and third rows are what made me stop worrying about the window.
Qwen3.5 uses a hybrid attention design in which most layers keep a
fixed-size state instead of a cache that grows with every token, so the
window is close to free on this model. On a conventional model the 64k row
would have been several GB higher. Ollama also ran this model on its MLX
runner, Apple's machine-learning framework, rather than the usual llama.cpp
backend.

Speed was the same at every size: about 20 tokens per second generating and
about 180 tokens per second reading a prompt, measured on a 1,360-token
prompt. Loading the model from disk took 4.5 seconds. With it loaded, the
machine still had 29 to 33 percent of its memory free.

## The setup

Ollama comes from Homebrew and the model is one command:

```sh
brew install --cask ollama
ollama pull qwen3.5:9b
```

OpenCode reads `~/.config/opencode/opencode.json`. This is the whole file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "ollama/qwen3.5:9b",
  "small_model": "ollama/qwen3.5:9b",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": { "baseURL": "http://localhost:11434/v1" },
      "models": {
        "qwen3.5:9b": {
          "name": "qwen3.5:9b (local)",
          "limit": { "context": 65536, "output": 16384 }
        }
      }
    }
  }
}
```

The `small_model` line matters. OpenCode uses a second, cheaper model for
things like naming the session, and without that line it reaches for a cloud
provider you have no key for.

Then Conductor: install it, sign in with GitHub, add a repository, and under
Settings, Agents, OpenCode the model appears as `ollama/qwen3.5:9b`. Pick it
in the chat box and you are running locally. The scripts I used, including
a verify step that measures speed and checks that the model can emit a tool
call, are in a small repo:
[local-ai-coding-setup](https://github.com/hchaurasia1/local-ai-coding-setup).

## What went wrong

Three things, all of them more useful than the parts that worked.

**The context length has two owners.** Ollama's documentation says to set
`OLLAMA_CONTEXT_LENGTH`, and for an app on macOS that means `launchctl
setenv`. That worked once: the first value I set, 32k, took effect. Changing
it to 64k did nothing. The Ollama menu-bar app has its own context slider in
its Settings, and once that has a value stored it wins over the environment
variable. My install script now reads the context the server is actually
running from `ollama ps` and refuses to continue if it does not match the
profile. That is the check that would have saved me an hour.

**My first speed number was wrong.** The first run reported 7 tokens per
second of prompt processing, which would make an agent unusable. It was
measured on a 12-token prompt, where fixed overhead swamps everything. On a
1,360-token prompt the same model reads at 179 tokens per second. Measure on
something the size of a real file.

**The app ignores a polite quit.** Asking the Ollama app to quit through
AppleScript does nothing. Killing the process works, but the relaunch took
longer than the 60 seconds my script waited, so it gave up once. A script
that restarts a menu-bar app needs a longer wait and a way to hand control
back to the person at the keyboard.

## What it is like to use

The first reply to "Hi" took 1 minute 15 seconds. The second reply, to a
longer question, took 11 seconds. The screenshot is the whole session, with
the model picker at the bottom showing `qwen3.5:9b (local)`; I have only
blanked out a local file path.

![A Conductor session with the local model: the first reply took 1m 15s, the second 11s](/img/qwen-local/conductor-session.png)

That gap is the whole story of running an agent locally. The two words I
typed reached the model together with OpenCode's entire system prompt and
the schema for every tool it has, several thousand tokens. At 180 tokens per
second that is over a minute of reading before the first character comes
back. Ollama caches what it has already processed, so the next turn only
reads what is new, and 11 seconds is what a turn costs from then on.

At 20 tokens per second, a 200-token reply takes 10 seconds to write and a
1,300-token file takes 7 seconds to read. A 9B model is nowhere near a
frontier model at agentic work. Expect small, well-scoped tasks, and read
every diff. I have not yet put it through a real multi-file change; that is
the next thing to measure, and I will add it here.

## What changes with more memory

I will move this setup to an M3 Pro with 36 GB. That buys the 19 GB
Qwen3-Coder 30B, which is tuned for code and activates about 3B parameters
per token, so it should be both better and faster than the 9B. The scripts
take a profile per machine, so the swap is one argument. I will add the
numbers when I have them.
