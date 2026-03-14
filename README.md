# Local Business AI

AI-powered customer operations platform for local service businesses such as:

- dental clinics
- beauty salons
- fitness studios
- repair services
- real estate agencies

Core capability:

Lead → Booking → Reminder → Follow-up → Review → Reactivation

This repository uses an AI-first development workflow.

AI agents (CodeX / Cursor / Claude Code) are expected to scaffold and implement the system based on the architecture defined below.

---

# Tech Stack

Frontend
- Next.js
- TypeScript
- TailwindCSS

Backend
- NestJS
- TypeScript

Database
- PostgreSQL
- Prisma ORM

Async / Queue
- Redis
- BullMQ

Messaging
- Twilio (SMS / WhatsApp)
- Resend (Email)

AI
- Provider abstraction layer
- OpenAI / Anthropic

Deployment
- Docker

Architecture
- Modular Monolith
- Monorepo

---

# Repository Structure
