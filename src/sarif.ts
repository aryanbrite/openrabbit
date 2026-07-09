import type { ReviewComment, ReviewCommentType, ReviewResponse } from './types.js'

type SarifLevel = 'error' | 'warning' | 'note'

const LEVEL_BY_TYPE: Record<ReviewCommentType, SarifLevel> = {
  bug: 'error',
  security: 'error',
  'scope-drift': 'warning',
  reuse: 'warning',
  suggestion: 'warning',
  style: 'warning',
  question: 'warning',
}

const ALL_TYPES: ReviewCommentType[] = [
  'bug',
  'security',
  'scope-drift',
  'reuse',
  'suggestion',
  'style',
  'question',
]

export function buildSarif(response: ReviewResponse, toolName = 'OpenRabbit'): string {
  const rules = ALL_TYPES.map((type) => ({
    id: `openrabbit/${type}`,
    name: `openrabbit/${type}`,
    shortDescription: { text: `OpenRabbit ${type} finding` },
    fullDescription: { text: `OpenRabbit flagged this as a ${type} issue.` },
    defaultConfiguration: { level: LEVEL_BY_TYPE[type] },
    helpUri: 'https://github.com/aryanbrite/openrabbit',
  }))

  const results = response.comments
    .filter(
      (
        comment,
      ): comment is ReviewComment & { type: ReviewCommentType; path: string; line: number } =>
        Boolean(comment.type) &&
        typeof comment.path === 'string' &&
        typeof comment.line === 'number',
    )
    .map((comment) => {
      const type = comment.type as ReviewCommentType
      return {
        ruleId: `openrabbit/${type}`,
        ruleIndex: ALL_TYPES.indexOf(type),
        level: LEVEL_BY_TYPE[type],
        message: { text: comment.body },
        locations: [
          {
            physicalLocation: {
              artifactLocation: { uri: comment.path },
              region: { startLine: comment.line },
            },
          },
        ],
      }
    })

  const sarif = {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [
      {
        tool: {
          driver: {
            name: toolName,
            informationUri: 'https://github.com/aryanbrite/openrabbit',
            rules,
          },
        },
        results,
      },
    ],
  }

  return JSON.stringify(sarif, null, 2)
}
