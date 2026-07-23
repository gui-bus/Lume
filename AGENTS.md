# 🏛️ AGENTS.md - Diretrizes do Projeto Lume

Este arquivo estabelece a visão geral, convenções de desenvolvimento e regras obrigatórias do projeto **Lume**. Todas as interações, desenvolvimento e modificações de código devem seguir as diretrizes documentadas aqui.

---

## 📌 Visão Geral do Projeto

O **Lume** é uma aplicação web de alta performance focada no gerenciamento, criação e compartilhamento de currículos profissionais, cartas de apresentação personalizadas e mensagens de e-mail para recrutadores, incluindo otimização para ATS (Applicant Tracking System), análise de compatibilidade de vagas e exportação/preview em tempo real em formato PDF com internacionalização (i18n).

---

## 🛠️ Stack Tecnológica

| Camada             | Tecnologia                            | Detalhes                                              |
| :----------------- | :------------------------------------ | :---------------------------------------------------- |
| **Framework**      | Next.js 16 (App Router)               | Servidor e rotas dinâmicas `[locale]` com `next-intl` |
| **Linguagem**      | TypeScript                            | Tipagem estrita em toda a aplicação                   |
| **Estilização**    | Tailwind CSS 4 + Radix UI / shadcn/ui | Interface moderna e responsiva com modo escuro        |
| **Autenticação**   | Clerk (`@clerk/nextjs`)               | Proteção de rotas e sincronização de usuários         |
| **Banco de Dados** | PostgreSQL via Prisma ORM             | Modelagem E-R com suporte a JSON e índices compostos  |
| **PDF Engine**     | `@react-pdf/renderer`                 | Renderização vetorial executada no client-side        |
| **Validações**     | Zod + React Hook Form                 | Validação de esquemas e formulários                   |
| **Testes**         | Vitest + React Testing Library        | Testes unitários para validadores e componentes       |

---

## 🛑 Regras Obrigatórias de Código e Desenvolvimento

1. **Proibido Comentários de Linha em Código (`//`)**:
   - Não adicione novos comentários em linha (`//`).
   - Se encontrar ou editar linhas com `//`, remova-as para manter o código limpo.
2. **Validação Obrigatória via Schema Zod**:
   - Todas as operações com dados de currículo devem respeitar rigorosamente o `ResumeSchema` localizado em `src/lib/validations/resume-schema.ts`.
3. **Padrão de Mutações de Dados**:
   - Utilize exclusivamente **Next.js Server Actions** (`src/app/actions/resumeActions.ts` e `src/app/actions/coverLetterActions.ts`) para lidar com persistência de dados.
4. **Commits Convencionais**:
   - Todos os commits devem seguir o padrão Conventional Commits (ex: `feat: ...`, `fix: ...`, `docs: ...`).
5. **Internacionalização Obrigatória**:
   - Todo fluxo e componente visual deve respeitar os locais suportados (`pt`, `en`) via `next-intl`.

---

## 📂 Estrutura de Pastas do Projeto

```text
Lume/
├── docs/                 # Documentação técnica detalhada (Arquitetura, BD, Regras de Negócio)
├── prisma/               # Schema do banco de dados e migrations
├── public/               # Ativos estáticos e fontes
└── src/
    ├── app/              # App Router do Next.js (rotas [locale], auth, share, Server Actions)
    ├── components/       # Componentes React (editor, pdf, preview, ui)
    ├── hooks/            # Custom React Hooks
    ├── i18n/             # Configurações de rotas e internacionalização
    ├── lib/              # Validações Zod, motores de ATS/Spellchecker e cliente Prisma
    ├── proxy.ts          # Middleware unificado de Auth (Clerk) + i18n (next-intl)
    └── types/            # Definições de tipos TypeScript (ResumeData, etc.)
```

---

## 🚀 Guia Rápido de Execução

- **Instalação**: `pnpm install`
- **Banco de Dados Local**: `docker-compose up -d`
- **Executar Migrações**: `pnpm prisma migrate dev`
- **Servidor de Desenvolvimento**: `pnpm dev`
- **Executar Testes**: `pnpm test`
