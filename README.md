# MindHacker

Emotionally intelligent education system that adapts in real-time to how a learner feels. Three modes: talk through personal dilemmas with Dr. Mindhacker, get tutored on any curriculum with emotionally adaptive chat, or remix modules into creative formats like cooking recipes, debate formats, and more.

## Architecture

```
Browser (Next.js)                 AWS Cloud
+-----------------+     HTTPS     +-------------------+
| Vercel           | ------------> | API Gateway (HTTP)|
| (Next.js 16)     |               +--------+----------+
|                  |                        |
|                  |               +--------v----------+
|                  |  Function URL |  Lambda Functions  |
|                  | ------------> |  (Python 3.12)     |
|                  |  (chat/remix) |                    |
+-----------------+               |  chat / upload /   |
                                  |  session / progress|
                                  +----+----------+----+
                                       |          |
                              +--------v--+  +----v--------+
                              | DynamoDB   |  | Bedrock     |
                              | (sessions) |  | (Claude)    |
                              +------------+  +-------------+
```

## How It Works

A single orchestrator agent (Claude on Bedrock) powers all interactions. It has access to tool-use capabilities that handle specialized tasks:

| Tool | Purpose |
|------|---------|
| **assess_emotional_state** | Detects engagement, confidence, frustration, curiosity, cognitive load |
| **adapt_content** | Rewrites explanations based on the learner's emotional state |
| **generate_assessment** | Creates emotionally-calibrated quizzes |
| **parse_curriculum** | Structures uploaded documents into learning nodes |
| **get_next_curriculum_node** | Navigates the curriculum graph based on progress |

Each tool call is dispatched to a specialist sub-prompt on Bedrock, then the orchestrator synthesizes the results into a single response.

## Features

- **Three Modes** — Dr. Mindhacker (AI counselor/coach), Courseware Chat (curriculum tutoring), Remixer (creative format transformation)
- **Sample Curricula** — Pick from built-in samples or upload your own PDF/text
- **Emotional Dashboard** — Real-time gauges for engagement, confidence, frustration, curiosity, and cognitive load
- **Content Adaptation** — Responses adjust tone, complexity, and encouragement based on emotional signals
- **Remix** — Transform any curriculum module into songwriting projects, basketball analogies, cooking recipes, debate formats, comic strips, game shows, or custom formats
- **Voice Conversation** — ElevenLabs Conversational AI voice agent
- **Curriculum Graph** — Visual node graph with completion state and progress tracking
- **Trauma-Informed** — All interactions follow trauma-informed pedagogy principles (safety, trust, choice, collaboration, empowerment)

## Tech Stack

**Frontend:** Next.js 16, React 19, Tailwind CSS 4, TypeScript, Recharts, ElevenLabs React SDK

**Backend:** Python 3.12, AWS Lambda, Amazon Bedrock (Claude Sonnet 4), DynamoDB, S3

**Infrastructure:** AWS SAM, CloudFormation, API Gateway (HTTP API), Lambda Function URLs, Vercel

## Prerequisites

- Node.js 18+
- Python 3.12
- AWS CLI configured with credentials
- AWS SAM CLI
- An ElevenLabs account with a Conversational AI agent (optional, for voice tab)

## Setup

### 1. Clone and install

```bash
git clone <repo-url> && cd mindhacker
cd frontend && npm install
```

### 2. Environment variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com/prod
NEXT_PUBLIC_CHAT_URL=https://<function-url>.lambda-url.<region>.on.aws/
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=<your-agent-id>   # optional
```

`NEXT_PUBLIC_CHAT_URL` is a Lambda Function URL that bypasses API Gateway's 30-second timeout for chat and remix requests.

### 3. Deploy backend

```bash
bash scripts/deploy.sh
```

This provisions:
- 4 Lambda functions (chat, upload, session, progress)
- DynamoDB table (`mindhacker-sessions`)
- S3 buckets (curriculum storage + frontend hosting)
- IAM role with Bedrock, DynamoDB, and S3 permissions

After deploying, create a Function URL for the chat Lambda:

```bash
aws lambda create-function-url-config \
  --function-name mindhacker-chat \
  --auth-type NONE \
  --cors '{"AllowOrigins":["*"],"AllowHeaders":["*"],"AllowMethods":["*"]}' \
  --region <region>

aws lambda add-permission \
  --function-name mindhacker-chat \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal '*' \
  --function-url-auth-type NONE \
  --region <region>
```

### 4. Run frontend locally

```bash
cd frontend && npm run dev
```

### 5. Deploy frontend to Vercel

```bash
cd frontend && vercel --prod
```

Set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CHAT_URL`, and `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` in Vercel environment variables.

## Project Structure

```
mindhacker/
  backend/
    agents/          # Orchestrator prompts, dispatcher, tool definitions
    handlers/        # Lambda entry points (chat, upload, session, progress)
    models/          # Data models (curriculum, emotional state, session)
    utils/           # Bedrock + DynamoDB helpers
    layers/          # Lambda Layer with vendored Python deps
  frontend/
    src/
      app/           # Next.js App Router pages + globals.css
      components/    # React components (ChatPanel, RemixPanel, VoicePanel, ...)
      lib/           # API client, hooks, types, demo sessions, samples
  infrastructure/
    template.yaml    # SAM / CloudFormation template
  scripts/
    deploy.sh        # One-command deploy script
```
