# Local Business AI

AI-powered customer operations platform for local service businesses such as:

- dental clinics
- beauty salons
- fitness studios
- repair services
- real estate agencies

Core automation loop:

Lead → Booking → Reminder → Follow-up → Review → Reactivation

This repository follows an **AI‑first development workflow**.  
AI coding agents (CodeX / Cursor / Claude Code) should scaffold and implement the system based on the architecture defined below.

---

## Architecture Overview

Product type:

Customer Operations Platform with AI Assistance

Core components:

- CRM (customer management)
- Appointment booking
- Automated workflow engine
- Messaging (SMS / Email)
- Review collection
- AI-assisted operations

AI is **assistive only**, not autonomous.

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- TypeScript

### Database
- PostgreSQL
- Prisma ORM

### Messaging
- Twilio (SMS)
- Resend (Email)

### Async Jobs (future)
- Redis
- BullMQ

### AI
- OpenAI (default)
- Anthropic (optional)

### Deployment
- Docker

### Architecture Pattern
- Modular Monolith
- Monorepo

---

## Repository Structure

apps/
  web/        # Next.js dashboard
  api/        # NestJS backend

packages/
  shared/     # shared types / utilities

infra/
  docker/

docs/

---

## Backend Modules

The backend MUST follow modular architecture.

Modules:

- auth
- workspace
- customers
- appointments
- messaging
- workflows
- reviews
- ai
- dashboard

Rules:

- Modules own their business logic
- No cross-module database access
- Timeline is implemented as a query layer, not a module

---

## MVP Database Tables

Core tables:

- workspace
- user
- customer
- appointment
- message
- workflow_rule
- task
- review

Design rules:

- Leads are NOT a separate table
- Use `customer.status = new_lead`

---

## Customer Status

new_lead  
contacted  
booked  
active  
inactive  
lost  

---

## Workflow Triggers

lead_created  
lead_not_contacted_24h  
appointment_booked  
appointment_reminder  
appointment_completed  
customer_inactive_30d  

---

## Workflow Actions

send_message  
create_task  
update_customer_status  
assign_owner  
request_review  

---

## Messaging Channels (MVP)

SMS  
Email  

Future:

- WhatsApp

---

## AI Assist (MVP)

AI assists human operators.

Functions:

- lead intent classification
- message rewrite
- customer summary
- next best action suggestion

Rules:

- AI must never automatically send messages
- AI must not control workflows
- AI output must require human confirmation

---

## Development Rules

AI coding agents must follow these rules:

1. Do NOT introduce microservices
2. Keep modular monolith architecture
3. Do NOT add unnecessary database tables
4. Do NOT build complex analytics systems
5. Do NOT implement chatbot UI
6. Focus on CRM + booking + workflow automation
7. Prefer scaffold‑first, business‑logic‑later

---

## Development Phases

Phase 1  
Auth  
Workspace  
Customers  

Phase 2  
Appointments  
Messaging  

Phase 3  
Workflow Engine  

Phase 4  
Reviews  

Phase 5  
Dashboard  

Phase 6  
AI Assist  

---

## Initial Build Goal

Generate a **clean runnable project skeleton** including:

- pnpm workspace
- Next.js frontend
- NestJS backend
- Prisma configuration
- Docker compose
- environment variable template
- backend module skeletons
- frontend page skeletons

Do NOT implement full business logic yet.

---

## Non‑Goals for MVP

Out of scope for MVP:

- chatbot‑first product
- omnichannel inbox
- campaign engine
- advanced analytics platform
- billing / invoicing
- microservices split
- complex RBAC systems

---

## Product Value

This platform helps businesses:

- never miss a lead
- never miss a booking
- never miss a reminder
- never miss a follow‑up
- collect more reviews
- increase repeat customers

---

## Internationalization

Supported languages (v1):

- English
- Chinese

Requirements:

- UI must support i18n
- customer preferred language stored
- templates support multiple languages
- date/time/phone/currency internationalized

---

## Future Expansion

Possible future features:

- WhatsApp messaging
- service catalog table
- multi‑location management
- staff performance analytics
- Redis/BullMQ job processing
- AI workflow suggestions
