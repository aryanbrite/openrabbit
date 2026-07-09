import type { ReviewResponse } from './types.js'

export function formatSummaryMarkdown(response: ReviewResponse): string {
  const { summary } = response
  const sections: string[] = []

  sections.push(
    summary.verdict ? `## OpenRabbit review — ${summary.verdict}` : '## OpenRabbit review',
  )

  if (summary.primaryGoal) {
    sections.push(`**Goal:** ${summary.primaryGoal}`)
  }
  if (summary.overview) {
    sections.push(summary.overview)
  }
  if (summary.actionItems.length) {
    sections.push(
      `### Action items\n${summary.actionItems.map((item) => `- [ ] ${item}`).join('\n')}`,
    )
  }
  if (response.comments.length) {
    const listed = response.comments
      .slice(0, 20)
      .map(
        (c) =>
          `- \`${c.path}:${c.line}\`${c.type ? ` _(${c.type})_` : ''}: ${c.body.split('\n')[0]}`,
      )
      .join('\n')
    sections.push(`### Inline comments (${response.comments.length})\n${listed}`)
  }
  if (response.separatePrSuggestions.length) {
    sections.push(
      `### Suggested separate PRs\n${response.separatePrSuggestions.map((s) => `- ${s}`).join('\n')}`,
    )
  }

  return `${sections.join('\n\n')}\n`
}
