# Local Business AI

AI-powered customer operations platform for local service businesses such as:

- dental clinics
- beauty salons
- fitness studios
- repair services
- real estate agencies

Core capability:

Lead -> Booking -> Reminder -> Follow-up -> Review -> Reactivation

This repository uses an AI-first development workflow.

AI agents (CodeX / Cursor / Claude Code) are expected to scaffold and implement the system based on the architecture defined below.

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

### Async / Queue
- Redis
- BullMQ

### Messaging
- Twilio (SMS / WhatsApp)
- Resend (Email)

### AI
- Provider abstraction layer
- OpenAI / Anthropic

### Deployment
- Docker

### Architecture
- Modular Monolith
- Monorepo

---

## Repository Structure

```text
apps/
  web/          # Next.js dashboard
  api/          # NestJS backend

packages/
  shared/       # shared types / utils

infra/
  docker/

docs/
Backend Modules

The backend MUST use modular architecture.

Modules:

auth

workspace

customers

appointments

messaging

workflows

reviews

ai

dashboard

MVP Database Tables

The MVP should stay minimal.

Core tables:

workspace

user

customer

appointment

message

workflow_rule

task

review

Notes:

Leads should NOT be a separate table

Use customer.status = "new_lead"

Customer Status
new_lead
contacted
booked
active
inactive
lost
Workflow Triggers
lead_created
lead_not_contacted_24h
appointment_booked
appointment_reminder
appointment_completed
customer_inactive_30d
Workflow Actions
send_message
create_task
update_customer_status
assign_owner
request_review
Messaging Channels (MVP)
SMS
Email

WhatsApp will be added later.

AI Assist (MVP)

AI should only assist operations.

Functions:

lead intent classification

message rewrite

customer summary

next best action

AI must not control workflows.

Development Rules

AI agents must follow these rules:

Do not introduce microservices

Keep the architecture modular monolith

Do not add unnecessary tables

Do not implement complex analytics

Do not implement chatbot UI

Focus on CRM + booking + workflow automation

Keep the MVP practical and lightweight

Prefer scaffold-first, business-logic-later

Development Phases
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

AI Agent Instructions

If you are an AI coding agent:

Scaffold the monorepo structure

Initialize NestJS backend

Initialize Next.js frontend

Setup pnpm workspace

Setup Prisma schema

Implement module skeletons

Do not implement full business logic yet

Initial Build Goal

The first goal is to generate a clean, runnable project skeleton that includes:

monorepo workspace setup

frontend app scaffold

backend app scaffold

Prisma configuration

Docker configuration

environment variable template

backend module skeletons

frontend page skeletons

Do not overbuild the system in the first pass.

Non-Goals for MVP

The following items are explicitly out of scope for MVP:

chatbot-first product design

omnichannel inbox

advanced analytics platform

campaign engine

microservices split

billing / invoicing

deep industry-specific logic

full RBAC complexity

custom workflow scripting language

Product Positioning

This product is NOT primarily a chatbot.

It is a workflow-driven customer operations platform with AI assistance.

Primary value:

never miss a lead

never miss a booking

never miss a reminder

never miss a follow-up

collect more reviews

improve repeat bookings

Internationalization

The product must support multilingual operation from day one.

Initial languages:

English

Chinese

Requirements:

UI text must be i18n-ready

customer preferred language should be stored

templates must support language-specific variants

date/time/phone/currency design should be international-friendly

Future Expansion (Not MVP)

Possible future expansions include:

WhatsApp messaging

service catalog table

multi-location management

staff performance analytics

Redis/BullMQ job scaling

AI-generated workflow suggestions

more provider integrations
