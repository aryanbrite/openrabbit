import { describe, expect, it } from 'vitest'
import { formatSummaryMarkdown } from '../src/summary.js'
import type { ReviewResponse } from '../src/types.js'

describe('formatSummaryMarkdown', () => {
  it('renders verdict, goal, action items and comments', () => {
    const response: ReviewResponse = {
      summary: {
        verdict: 'needs changes',
        primaryGoal: 'Add validation',
        overview: 'Overview here',
        reuseNotes: [],
        actionItems: ['Write tests'],
      },
      comments: [{ path: 'src/a.ts', line: 3, body: 'First line\nSecond line', type: 'bug' }],
      separatePrSuggestions: ['Split refactor'],
      requestedFiles: [],
    }
    const md = formatSummaryMarkdown(response)
    expect(md).toContain('## OpenRabbit review — needs changes')
    expect(md).toContain('**Goal:** Add validation')
    expect(md).toContain('- [ ] Write tests')
    expect(md).toContain('src/a.ts:3')
    expect(md).toContain('### Suggested separate PRs')
  })

  it('falls back to a plain heading without a verdict', () => {
    const response: ReviewResponse = {
      summary: { overview: 'ok', reuseNotes: [], actionItems: [] },
      comments: [],
      separatePrSuggestions: [],
      requestedFiles: [],
    }
    expect(formatSummaryMarkdown(response)).toContain('## OpenRabbit review')
  })
})
