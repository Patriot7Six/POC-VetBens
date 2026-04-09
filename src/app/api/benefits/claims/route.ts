import { streamAI } from '@/lib/ai/adapter'
import { CLAIMS_SYSTEM_PROMPT } from '@/lib/ai/prompts/benefits'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  condition:        z.string().min(2).max(200),
  serviceConnection:z.string().optional(), // how they believe it's connected to service
  currentStatus:    z.enum(['not_filed', 'pending', 'denied', 'appealing', 'rated']).default('not_filed'),
  currentRating:    z.number().min(0).max(100).optional(),
  hasEvidence:      z.boolean().default(false),
  seenVSO:          z.boolean().default(false),
  question:         z.string().max(1000).optional(), // specific question from user
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data

    const statusDescriptions: Record<string, string> = {
      not_filed:  'Has not yet filed a claim for this condition',
      pending:    'Claim is currently pending / in review',
      denied:     'Claim was denied and considering options',
      appealing:  'Currently in the appeals process',
      rated:      `Already rated at ${data.currentRating ?? 0}%, seeking increase or secondary conditions`,
    }

    const userMessage = `
I need guidance on filing/managing a VA disability claim for this veteran:

Condition: ${data.condition}
Service Connection: ${data.serviceConnection ?? 'Not yet established / unknown'}
Current Claim Status: ${statusDescriptions[data.currentStatus]}
Has Supporting Evidence: ${data.hasEvidence ? 'Yes' : 'No'}
Has Seen a VSO: ${data.seenVSO ? 'Yes' : 'No'}
Specific Question: ${data.question ?? 'Please provide general guidance on next steps'}

Please provide specific, actionable guidance for this situation.
`.trim()

    const stream = await streamAI({
      task:         'claims_guidance',
      systemPrompt: CLAIMS_SYSTEM_PROMPT,
      userMessage,
      stream:       true,
    })

    return new Response(stream, {
      headers: {
        'Content-Type':  'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('[benefits/claims]', error)
    return Response.json({ error: 'Guidance unavailable. Please try again.' }, { status: 500 })
  }
}

export const maxDuration = 60
