# MindHacker

Emotionally intelligent education system that adapts in real-time to how a learner feels. Upload any curriculum and MindHacker's five AI agents collaborate to deliver personalized lessons, detect emotional shifts, and remix content into creative formats.

## Architecture

```
Browser (Next.js)                 AWS Cloud
+-----------------+     HTTPS     +-------------------+
| Static export   | ------------> | API Gateway (HTTP)|
| hosted on S3 +  |               +--------+----------+
| CloudFront CDN  |                        |
+-----------------+               +--------v----------+
                                  |  Lambda Functions  |
                                  |  (Python 3.12)     |
                                  |                    |
                                  |  chat / upload /   |
                                  |  session / progress|
                                  +----+----------+----+
                                       |          |
                              +--------v--+  +----v--------+
                              | DynamoDB   |  | Bedrock     |
                              | (sessions) |  | (Claude)    |
                              +------------+  +-------------+
```

## AI Agents

| Agent | Role |
|-------|------|
| **Orchestrator** | Routes conversations, selects tools, maintains coherence |
| **Emotional Assessor** | Detects engagement, confidence, frustration, curiosity, cognitive load |
| **Curriculum Architect** | Parses uploaded documents into structured learning nodes |
| **Content Adapter** | Rewrites explanations based on the learner's emotional state |
| **Assessment Generator** | Creates quizzes and checks for understanding |

## Features

- **Curriculum Parsing** - Upload PDF or text; auto-generates a node graph with prerequisites
- **Emotional Assessment** - Real-time gauges for engagement, confidence, frustration, curiosity, and cognitive load
- **Content Adaptation** - Responses adjust tone, complexity, and encouragement based on emotional signals
- **Voice Conversation** - ElevenLabs Conversational AI voice agent (Voice tab)
- **Remix** - Transform any curriculum module into songwriting projects, basketball analogies, cooking recipes, debate formats, and more
- **Progress Tracking** - Visual curriculum graph with completion state and flow scores

## Tech Stack

**Frontend:** Next.js 16, React 19, Tailwind CSS 4, TypeScript, Recharts, ElevenLabs React SDK

**Backend:** Python 3.12, AWS Lambda, Amazon Bedrock (Claude), DynamoDB, S3

**Infrastructure:** AWS SAM, CloudFormation, CloudFront, API Gateway (HTTP API)

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
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=<your-agent-id>   # optional
```

### 3. Deploy backend

```bash
bash scripts/deploy.sh
```

This runs `sam build` and `sam deploy --guided` from the `infrastructure/` directory, provisioning:
- 4 Lambda functions (chat, upload, session, progress)
- DynamoDB table (`mindhacker-sessions`)
- S3 buckets (curriculum storage + frontend hosting)
- CloudFront distribution
- IAM role with Bedrock, DynamoDB, and S3 permissions

### 4. Run frontend locally

```bash
cd frontend && npm run dev
```

Or build for static export:

```bash
cd frontend && npm run build
```

Then sync `frontend/out/` to the S3 frontend bucket.

## Project Structure

```
mindhacker/
  backend/
    agents/          # AI agent prompts, dispatcher, tool definitions
    handlers/        # Lambda entry points (chat, upload, session, progress)
    models/          # Pydantic models (curriculum, emotional state, session)
    utils/           # Bedrock + DynamoDB helpers
    layers/          # Lambda Layer with vendored Python deps
  frontend/
    src/
      app/           # Next.js App Router pages + globals.css
      components/    # React components (ChatPanel, RemixPanel, VoicePanel, ...)
      lib/           # API client, hooks, types, voice utils
  infrastructure/
    template.yaml    # SAM / CloudFormation template
  scripts/
    deploy.sh        # One-command deploy script
```
