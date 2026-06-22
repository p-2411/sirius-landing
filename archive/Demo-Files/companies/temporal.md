# Temporal
**Conviction Score:** 7.2/10
**Category:** Workflow Orchestration
**Website:** https://temporal.io

## What It Does
Temporal is a durable workflow orchestration platform that enables developers to build reliable, long-running distributed applications and AI pipelines. It provides a programming model where workflows are written as ordinary code but are automatically made fault-tolerant — surviving process crashes, network failures, and infrastructure outages — through a durable execution engine that replays workflow history to restore state.

## Why It Matters
Modern distributed applications and AI agent pipelines are inherently fragile: network failures, timeouts, and infrastructure interruptions routinely corrupt state and break multi-step processes. Temporal solves this at the infrastructure level, letting developers write complex, stateful, long-running workflows in familiar programming languages without manually implementing retries, state machines, or distributed transaction logic. As AI agents that execute long multi-step tasks become mainstream, durable execution becomes critical infrastructure.

## Target Customer
- Platform and backend engineering teams at mid-to-large technology companies
- AI/ML teams building multi-step agent pipelines requiring fault tolerance
- Fintech, e-commerce, and SaaS companies with complex transaction and orchestration workflows
- DevOps and infrastructure teams replacing fragile cron jobs and custom state machines

## Market Category
Durable Workflow Orchestration / Distributed Systems Infrastructure

## Competitors
- Apache Airflow (data pipeline orchestration)
- Prefect / Dagster (modern data orchestration)
- AWS Step Functions (cloud-native state machines)
- Azure Durable Functions
- Inngest, Trigger.dev (lighter-weight event-driven workflow platforms)
- Kestra (open-source orchestration)

## Technical Moat
- Built by the engineers who designed and ran Cadence at Uber — one of the most battle-tested workflow engines in the industry — providing unmatched domain authority
- The durable execution programming model is conceptually distinct and difficult to replicate; competitors building similar systems are years behind in production hardening
- Deep language SDKs (Go, Java, TypeScript, Python, .NET, PHP) with a large and growing contributor ecosystem
- Network effects: once Temporal is embedded in a company's critical workflows, replacing it is extremely high-risk, creating strong retention

## Traction Signals
- Series B at $100M raised, with backing from top-tier investors
- Widely adopted for critical production workflows at technology companies including Stripe, Snap, Coinbase, Netflix, and Datadog
- Technical traction score 8/10; founder quality 9/10; market timing 8/10
- Strong and growing open-source community on GitHub
- Increasingly cited as foundational infrastructure for AI agent pipelines

## Risks
- Sales cycle is long and adoption requires significant engineering buy-in — not a self-serve product in most enterprise scenarios
- Cloud providers (AWS Step Functions, Azure Durable Functions) are improving their native offerings, which could pressure Temporal's market in cloud-committed enterprises
- Temporal Cloud (managed service) needs to accelerate against self-hosted adoption to drive recurring revenue at scale
- Open-source nature means competitors can study and replicate the programming model, even if catching up operationally is hard

## Suggested Next Action
Connect with Maxim Fateev to understand Temporal Cloud ARR growth rate and enterprise customer expansion trends. Evaluate the AI agent pipeline use case as a growth driver — quantify what share of new workloads are AI-related versus traditional distributed systems.
