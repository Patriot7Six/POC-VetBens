import { streamAI } from '@/lib/ai/adapter'
import { ELIGIBILITY_SYSTEM_PROMPT } from '@/lib/ai/prompts/benefits'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  branch:           z.string().min(1),
  mosCode:          z.string().optional(),
  yearsOfService:   z.number().min(0).max(40),
  separationDate:   z.string().optional(),
  combatVet:        z.boolean().default(false),
  deploymentCount:  z.number().min(0).default(0),
  disabilities:     z.array(z.string()).default([]),
  locationState:    z.string().optional(),
  additionalContext:z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data

    const userMessage = `
Please analyze VA benefits eligibility for this veteran:

Branch of Service: ${data.branch}
MOS/Rating/AFSC: ${data.mosCode ?? 'Not provided'}
Years of Service: ${data.yearsOfService}
Separation Date: ${data.separationDate ?? 'Unknown / upcoming'}
Combat Veteran: ${data.combatVet ? 'Yes' : 'No'}
Number of Deployments: ${data.deploymentCount}
Self-reported disabilities/conditions: ${data.disabilities.length > 0 ? data.disabilities.join(', ') : 'None specified'}
State of Residence: ${data.locationState ?? 'Not specified'}
Additional context: ${data.additionalContext ?? 'None'}

Please provide a comprehensive benefits eligibility assessment.
`.trim()

    // Stream the response back to the client
    const stream = await streamAI({
      task:         'benefits_eligibility',
      systemPrompt: ELIGIBILITY_SYSTEM_PROMPT,
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
    console.error('[benefits/eligibility]', error)
    return Response.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}

// Rate limiting — 10 requests per IP per hour (enforced at edge via Vercel)
export const maxDuration = 60
