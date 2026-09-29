<p align="center">
  <img src="assets/logo.png" width="128" height="128" alt="OpenRabbit icon">
</p>

<h1 align="center">OpenRabbit</h1>

<p align="center">
  free, open-source, self-hosted GitHub PR reviewer that replaces third party reviewing tools. 
</p>

<p align="center">
  <b>:copilot:</b> <a href="https://github.com/Aledon8/OpenLeukemia/pull/12"><b>See Example PR</b></a><br>
  <b>✦</b> <a href="https://aryan.my/posts/open-rabbit"><b>Must read article on openrabbit</b></a><br>
  <sub></sub>
</p>

---

<p align="center">
  <img src="https://cdn.hackclub.com/019dd5c7-1c25-71b4-88c8-f04470b3d209/Untitled%20design%20(8)%20(1).png" alt="OpenRabbit demo" width="600">
</p>

<p align="center">
  <i>Thanks to the contributors and maintainers for making OpenRabbit possible.</i>
</p>
<!--
<p align="center">
  <a href="https://github.com/aryan6673/openrabbit/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=aryan6673/openrabbit" />
  </a>
</p>
-->

## Overview

OpenRabbit is a free (you can even get a free llm api explained below), open-source, self-hosted GitHub Pull Request reviewer. It analyzes PR diffs, consults a pluggable LLM provider (Groq / OpenRouter / others), and posts a concise, structured review: a human-readable summary and accurate inline comments or suggestions.

---

### Zero Hosting Required

You don't need to pay for a subscription or manage a server. OpenRabbit runs **completely** on your own GitHub Actions environment. Your code stays in your runner; it is never proxied or stored by a central authority.

---

## Quickstart in 2 minutes

Simply create a file at `.github/workflows/reviewer.yml` and paste the following:

```yaml
name: OpenRabbit Reviewer

on:
  pull_request_target:
    types: [opened, reopened, edited, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: OpenRabbit
        uses: aryanbrite/openrabbit@main
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          llm_api_key: ${{ secrets.LLM_API_KEY }}
          llm_provider: openrouter # Or groq
          llm_model: openrouter/free # Use world-class models for $0
          review_mode: both
          tone_mode: balanced
```
> [!IMPORTANT]  
> ## Setting Up Your API Key Securely
>
> Never hardcode your API key directly into your workflow file or commit it to GitHub.
>
> Instead, store it safely using **GitHub Actions Secrets**:
>
> 1. Open your GitHub repository  
> 2. Go to **Settings**  
> 3. Navigate to **Secrets and variables → Actions**  
> 4. Click **New repository secret**  
> 5. Create a secret named `LLM_API_KEY`  
> 6. Paste your API key as the value  
> 7. Click **Add secret**
>
> OpenRabbit will automatically use the secret securely inside your GitHub Actions workflow.
>
> This keeps your API key encrypted and prevents accidental leaks in commits, logs, or pull requests.
---

## The Open Source Fight

**OpenRabbit is a stand for [Open Source Ethics](https://www.openresourcelibrary.com/concepts/ethics/).**

OpenRabbit remove risks by shifting the power back to the developer. By running client-side in your own CI/CD, you maintain **total data sovereignty**. We believe you shouldn't have to trade your project's security for AI productivity.

---

## Features

- **Fixes the "Context Blindness" Problem**  
  Most AI reviewers act like your code exists in isolation, which is kinda dumb. OpenRabbit actually tries to understand the whole project:  
  - **Two-Stage File Fetch**: If it feels like it’s missing context, it can pull in extra files instead of just judging the diff blindly.  
  - **Linked Issue Awareness**: It reads linked GitHub issues so it knows what the code is *supposed* to do, not just if it compiles.

- **"Socratic Scaffold" (Basically a Mentor Mode)**  
  Instead of just dumping the answer, it acts like a mentor and asks questions so you figure stuff out yourself. It explains *why* something is wrong or risky, not just *what* is wrong. It only gives direct fixes when it’s something simple or obvious.

- **"Performance & Scalability Expert"**  
  This one is for serious code. It checks for things like race conditions, memory leaks, and slow logic (like O(n²)). It also makes sure you’re not ignoring caching or rewriting stuff that already exists. Basically, it asks: “Will this still work if traffic becomes 10x?”

- **"Security Auditor" (Catches Real Issues, Not Fake Ones)**  
  It ignores the PR description at first so it doesn’t get biased and just looks at the code. Then it checks for real problems like SQL injection, XSS, or broken auth. It also calls out fake “security improvements” where someone removes checks but claims things got safer.

- **No More "AI Slop"**  
  You know that polished but useless AI feedback? Yeah, this avoids that:  
  - **Suggestion Validation**: It checks if suggestions actually match your code before showing them.  
  - **Senior Engineer Voice**: It talks more like a real tech lead instead of nitpicking random naming stuff.

- **Stops "Vibe Coding" (DRIFT Detection)**  
  It flags when you change stuff that has nothing to do with the PR. Like random refactors or cleanup. It tells you to move that into a separate PR so things stay clean and easy to review.

---

## Getting a Free API Key

By default, this project uses the **OpenRouter free model pool**.  
It’s not perfect, the main issue is rate limits. To deal with that, it automatically rotates between different free models on OpenRouter so you don’t keep hitting the same limit again and again. It works, but it’s not super reliable or consistent.

If you want better performance and fewer interruptions, you should use your own API key.

---

## Review Modes

- **summary:** single summary review comment (no inline comments)  
- **inline:** post only inline comments and suggestions  
- **both:** post both the summary and inline comments (default)

---

## Contributing

- Open an issue or PR  
- See `src/llm` for adding new provider adapters  

---

## License

Licensed under the MIT license.

---

![version](https://img.shields.io/badge/version-v0.8.9-orange)

<a href="https://www.producthunt.com/products/openrabbit?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-openrabbit" target="_blank" rel="noopener noreferrer"><img alt="OpenRabbit - Free, AI PR reviewer that runs entirely in GitHub Actions | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1165149&amp;theme=dark&amp;t=1781176965489"></a>
[![Open Rabbit - GitHub Marketplace](https://cdn.hackclub.com/019eb67a-89f3-7264-aa55-c697e4c45795/download.svg)](https://github.com/marketplace/actions/open-rabbit)
[![Featured on Awesome AI Tools](https://cdn.hackclub.com/019eb679-3515-7725-ae81-247779e87c88/download.svg)](https://github.com/eudk/awesome-ai-tools)


