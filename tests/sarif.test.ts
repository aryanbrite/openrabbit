import { describe, expect, it } from 'vitest'
import { buildSarif } from '../src/sarif.js'
import type { ReviewResponse } from '../src/types.js'

function makeResponse(): ReviewResponse {
  return {
    summary: {
      verdict: 'needs changes',
      primaryGoal: 'Add input validation',
      overview: 'Overview text',
      reuseNotes: [],
      actionItems: ['Add a test', 'Handle nulls'],
    },
    comments: [
      { path: 'src/app.ts', line: 10, body: 'SQL injection risk', type: 'security' },
      { path: 'src/app.ts', line: 20, body: 'Off by one', type: 'bug' },
      { path: 'src/util.ts', line: 5, body: 'Use existing helper', type: 'reuse' },
    ],
    separatePrSuggestions: ['Extract config cleanup'],
    requestedFiles: [],
  }
}

describe('buildSarif', () => {
  it('produces a valid SARIF 2.1.0 structure', () => {
    const sarif = JSON.parse(buildSarif(makeResponse())) as any
    expect(sarif.version).toBe('2.1.0')
    expect(Array.isArray(sarif.runs)).toBe(true)
    expect(sarif.runs[0].tool.driver.name).toBe('OpenRabbit')
    expect(sarif.runs[0].tool.driver.rules).toHaveLength(7)
  })

  it('maps comments to results with the correct level', () => {
    const sarif = JSON.parse(buildSarif(makeResponse())) as any
    const results = sarif.runs[0].results
    expect(results).toHaveLength(3)
    const security = results.find((r: any) => r.ruleId === 'openrabbit/security')
    expect(security.level).toBe('error')
    expect(security.locations[0].physicalLocation.artifactLocation.uri).toBe('src/app.ts')
    expect(security.locations[0].physicalLocation.region.startLine).toBe(10)
    const reuse = results.find((r: any) => r.ruleId === 'openrabbit/reuse')
    expect(reuse.level).toBe('warning')
    expect(reuse.ruleIndex).toBe(
      sarif.runs[0].tool.driver.rules.findIndex((r: any) => r.id === 'openrabbit/reuse'),
    )
  })

  it('skips comments without a type', () => {
    const response = makeResponse()
    response.comments.push({ path: 'src/x.ts', line: 1, body: 'untyped note' })
    const sarif = JSON.parse(buildSarif(response)) as any
    expect(sarif.runs[0].results).toHaveLength(3)
  })
})
