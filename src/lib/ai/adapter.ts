import Anthropic from '@anthropic-ai/sdk'

// ─── Task types the platform uses ───────────────────────────────────────────
export type AITask =
  | 'benefits_eligibility'      // VA benefit eligibility analysis
  | 'claims_guidance'           // Claims filing walkthrough
  | 'mos_translation'           // MOS → civilian job mapping
  | 'resume_generation'         // Full AI resume generation
  | 'resume_tailoring'          // Tailor resume to job description
  | 'interview_questions'       // Generate role-specific questions
  | 'interview_feedback'        // Analyze STAR responses
  | 'salary_insights'           // Market compensation analysis
  | 'cover_letter'              // Cover letter generation
  | 'linkedin_optimizer'        // LinkedIn profile optimization
  | 'career_coach'              // Ongoing career conversation
  | 'jargon_translator'         // Military → civilian language

// ─── Model routing config ────────────────────────────────────────────────────
// Claude is primary for all tasks. This structure lets us route
// specific tasks to other models if/when needed without touching
// product code — just update the config here.
const MODEL_ROUTING: Record<AITask, { provider: 'anthropic'; model: string; maxTokens: number }> = {
  benefits_eligibility: { provider: 'anthropic', model: 'claude-opus-4-6',            maxTokens: 2048 },
  claims_guidance:      { provider: 'anthropic', model: 'claude-opus-4-6',            maxTokens: 2048 },
  mos_translation:      { provider: 'anthropic', model: 'claude-sonnet-4-6',          maxTokens: 1024 },
  resume_generation:    { provider: 'anthropic', model: 'claude-opus-4-6',            maxTokens: 4096 },
  resume_tailoring:     { provider: 'anthropic', model: 'claude-sonnet-4-6',          maxTokens: 2048 },
  interview_questions:  { provider: 'anthropic', model: 'claude-sonnet-4-6',          maxTokens: 2048 },
  interview_feedback:   { provider: 'anthropic', model: 'claude-sonnet-4-6',          maxTokens: 1024 },
  salary_insights:      { provider: 'anthropic', model: 'claude-sonnet-4-6',          maxTokens: 1024 },
  cover_letter:         { provider: 'anthropic', model: 'claude-sonnet-4-6',          maxTokens: 1500 },
  linkedin_optimizer:   { provider: 'anthropic', model: 'claude-sonnet-4-6',          maxTokens: 2048 },
  career_coach:         { provider: 'anthropic', model: 'claude-opus-4-6',            maxTokens: 2048 },
  jargon_translator:    { provider: 'anthropic', model: 'claude-haiku-4-5-20251001',  maxTokens: 512  },
}

// ─── Input/output types ───────────────────────────────────────────────────────
export interface AIRequest {
  task: AITask
  systemPrompt: string
  userMessage: string
  context?: Record<string, unknown>
  stream?: boolean
}

export interface AIResponse {
  content: string
  task: AITask
  model: string
  inputTokens: number
  outputTokens: number
}

// ─── Anthropic client (singleton) ────────────────────────────────────────────
let anthropicClient: Anthropic | null = null

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })
  }
  return anthropicClient
}

// ─── Main adapter function ────────────────────────────────────────────────────
export async function runAI(request: AIRequest): Promise<AIResponse> {
  const routing = MODEL_ROUTING[request.task]
  const client  = getAnthropicClient()

  const message = await client.messages.create({
    model: routing.model,
    max_tokens: routing.maxTokens,
    system: request.systemPrompt,
    messages: [
      {
        role: 'user',
        content: request.userMessage,
      },
    ],
  })

  const content = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('')

  return {
    content,
    task: request.task,
    model: routing.model,
    inputTokens:  message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
  }
}

// ─── Streaming variant ────────────────────────────────────────────────────────
export async function streamAI(request: AIRequest): Promise<ReadableStream> {
  const routing = MODEL_ROUTING[request.task]
  const client  = getAnthropicClient()

  const stream = await client.messages.create({
    model: routing.model,
    max_tokens: routing.maxTokens,
    system: request.systemPrompt,
    messages: [{ role: 'user', content: request.userMessage }],
    stream: true,
  })

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })
}
