import { describe, it, expect, vi, beforeAll } from 'vitest'
import { writeFileSync } from 'node:fs'

const { setOutput, setFailed } = vi.hoisted(() => ({
  setOutput: vi.fn(),
  setFailed: vi.fn(),
}))

vi.mock('node:fs/promises', () => ({
  appendFile: vi.fn(async () => {}),
  writeFile: vi.fn(async () => {}),
  mkdir: vi.fn(async () => {}),
}))

vi.mock('@actions/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@actions/core')>()
  return { ...actual, setOutput, setFailed }
})

vi.mock('../src/reviewer.js', () => ({
  runReview: vi.fn(async () => ({
    summary: {
      verdict: 'approved',
      primaryGoal: 'Add CI/CD',
      overview: 'Adds CI pipeline, SARIF, and summary.',
      reuseNotes: [],
      actionItems: [],
    },
    comments: [
      { type: 'security', path: 'src/app.ts', line: 10, body: 'Use parameterized queries.' },
    ],
    separatePrSuggestions: [],
    requestedFiles: [],
  })),
}))

let run: () => Promise<void>

beforeAll(async () => {
  process.env.GITHUB_STEP_SUMMARY = '/tmp/openrabbit-summary.md'
  process.env.GITHUB_REPOSITORY = 'octocat/hello'
  process.env.GITHUB_EVENT_PATH = '/tmp/openrabbit-event.json'
  writeFileSync('/tmp/openrabbit-event.json', JSON.stringify({ pull_request: { number: 7 } }))
  process.env.LLM_API_KEY = 'test-key'

  const mod = await import('../src/action.js')
  run = mod.run
})

describe('action entrant produces SARIF + summary', () => {
  it('writes a SARIF 2.1.0 file and sets the sarif-file output', async () => {
    await run()

    const fs = await import('node:fs/promises')
    const writeFile = fs.writeFile as unknown as ReturnType<typeof vi.fn>
    expect(writeFile).toHaveBeenCalledTimes(1)

    const sarif = writeFile.mock.calls[0][1] as string
    expect(sarif).toContain('"version": "2.1.0"')
    expect(sarif).toContain('openrabbit/security')

    expect(setOutput).toHaveBeenCalledWith('sarif-file', expect.any(String))
    expect(setFailed).not.toHaveBeenCalled()
  })

  it('appends the job summary to GITHUB_STEP_SUMMARY', async () => {
    await run()

    const fs = await import('node:fs/promises')
    const appendFile = fs.appendFile as unknown as ReturnType<typeof vi.fn>
    expect(appendFile).toHaveBeenCalled()
  })
})
