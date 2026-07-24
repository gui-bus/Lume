<div align="center">
  <br/>
  <br/>
  <img src="./public/logo_white.svg" alt="LUME Logo" width="280" />
</div>

<br />

## 🌟 Visão Geral

O **Lume** é uma plataforma profissional de candidaturas desenvolvida para ajudar candidatos a criar, gerenciar e otimizar todo o seu ecossistema de apresentação profissional (currículos de alta performance, cartas de apresentação elegantes e mensagens de e-mail personalizadas para recrutadores).

A plataforma permite estruturar informações de forma clara, validar currículos contra leitores ATS, organizar documentos por tags, e exportar currículos e cartas diretamente para PDF de alta qualidade com suporte total a múltiplos idiomas.

## 🚀 Deploy & Demonstração

O projeto está implantado e pronto para uso em produção no seguinte endereço:
👉 **[https://lume.guibus.dev/](https://lume.guibus.dev/)**

## 📸 Galeria

<img src="./public/preview/01-login.webp" alt="Tela de Login" width="100%" />
<img src="./public/preview/02-curriculo-modelo-um.webp" alt="Modelo de Currículo Um" width="100%" />
<img src="./public/preview/03-curriculo-modelo-dois.webp" alt="Modelo de Currículo Dois" width="100%" />
<img src="./public/preview/04-carta-de-apresentacao.webp" alt="Editor de Carta de Apresentação" width="100%" />
<img src="./public/preview/05-gerador-de-mensagem-email.webp" alt="Gerador de Mensagem de E-mail" width="100%" />

## 🛠️ Stack Tecnológica

<div align="center">
  <img alt="React" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React.svg">
  <img alt="NextJS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/NextJS.svg">
  <img alt="Typescript" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Typescript.svg">
  <img alt="TailwindCSS" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/TailwindCSS.svg">
  <img alt="ShadCNUI" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/ShadCNUI.svg">
  <img alt="Framer Motion" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Framer%20Motion.svg">
  <img alt="Radix" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Radix.svg">
  <img alt="Phosphor Icons" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Phosphor%20Icons.svg">
  <img alt="React Hook Form" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/React%20Hook%20Form.svg">
  <img alt="Zod" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Zod.svg">
  <img alt="PrismaORM" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/PrismaORM.svg">
  <img alt="PostgreSQL" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/PostgreSQL.svg">
  <img alt="Clerk" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Clerk.svg">
  <img alt="nextintl" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/nextintl.svg">
  <img alt="nuqs" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/nuqs.svg">
  <img alt="pnpm" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/pnpm.svg">
  <img alt="Vercel" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Vercel.svg">
  <img alt="Vitest" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Vitest.svg">
  <img alt="Playwright" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Playwright.svg">
  <img alt="ESLint" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/ESLint.svg">
  <img alt="Prettier" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Prettier.svg">
  <img alt="Husky" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Husky.svg">
  <img alt="Conventional Commits" height="60" width="60" src="https://github.com/gui-bus/TechIcons/blob/main/Dark/Conventional%20Commits.svg">
</div>

---

## 🏛️ Arquitetura do Sistema

O Lume utiliza uma arquitetura reativa moderna em que a edição do formulário sincroniza simultaneamente o visualizador em HTML e a compilação do canvas em PDF:

```mermaid
graph TB
    subgraph Client ["💻 Frontend Client-Side (Browser)"]
        UI["🎨 Editor Form (React Hook Form + Zod)"]
        Preview["👁️ Live Preview (HTML/Tailwind)"]
        PDF["📄 @react-pdf/renderer (Client Canvas)"]
        ATS["📊 ATS & Keyword Engine"]
    end

    subgraph Server ["⚡ Next.js 16 & Server Layer"]
        Proxy["🛡️ Proxy Middleware (Clerk + next-intl)"]
        Actions["⚡ Server Actions (resumeActions.ts)"]
    end

    subgraph DB ["🗄️ Camada de Banco de Dados"]
        Prisma["💎 Prisma ORM"]
        Postgres[("🐘 PostgreSQL")]
    end

    UI -->|Digitando em tempo real| Preview
    UI -->|Re-renderiza Canvas| PDF
    UI -->|Calcula Métricas| ATS
    UI -->|Salvar / Compartilhar| Proxy
    Proxy --> Actions
    Actions --> Prisma
    Prisma --> Postgres
```

---

## 🚀 Funcionalidades Principais

| Módulo                       | Funcionalidades                                                                                             | Detalhes Técnicos                                                                                                       |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **📝 Editor de Currículo**   | • Abas categorizadas<br/>• Drag & Drop reordering<br/>• Preenchimento dinâmico                              | Formulário reativo com `@dnd-kit/sortable` e estado gerenciado com validação Zod.                                       |
| **✉️ Carta de Apresentação** | • Editor dedicado integrado<br/>• Visualização HTML em tempo real<br/>• Mesmo estilo de cabeçalho e cor     | Geração de PDF vetorial de página única via `@react-pdf/renderer` com links clicáveis e padrão de nomenclatura limpo.   |
| **📧 Mensagem para E-mail**  | • Assistente de escrita em segundos<br/>• Três opções de tom de voz<br/>• Links `mailto` e cópia rápida     | Integração nativa de modelos dinâmicos de texto dependentes do idioma selecionado no frontend.                          |
| **📄 PDF Engine**            | • Preview instantâneo<br/>• Download direto em Blob<br/>• Temas de cores Hex<br/>• Modelos Clássico/Moderno | Desenvolvido com `@react-pdf/renderer` com suporte a múltiplos templates (1 e 2 colunas) sincronizados entre Web e PDF. |
| **🌐 Internacionalização**   | • Rotas `/pt` e `/en`<br/>• Versões vinculadas por `groupId`<br/>• Seletor dinâmico                         | Suporte completo via `next-intl` com sincronização automática do currículo no idioma correto.                           |
| **🔗 Links Públicos**        | • Slugs curtos e amigáveis<br/>• Métricas de `views` e `downloads`<br/>• Layout público limpo               | Rotas sob `/share/[id]` com incrementadores assíncronos e controle de sessão por cookie.                                |

---

## ⚖️ Motores de Inteligência & ATS

```mermaid
flowchart TD
    A["📥 Dados do Currículo (ResumeData JSON)"] --> B{"📊 Validador ATS"}
    A --> C{"🔍 Keyword Matcher"}
    A --> D{"✍️ Analisador de Verbos"}

    B --> B1["Checks de Contato, Resumo, Experiências, Skills e Word Count"]
    B1 --> B2["💯 Nota ATS (0 a 100) + Dicas de Melhoria"]

    C --> C1["Compara com Descrição da Vaga + Dicionário 80+ Skills"]
    C1 --> C2["🎯 % de Aderência + Habilidades Ausentes"]

    D --> D1["Detecta Verbos Fracos (ajudei, fiz, mexi)"]
    D1 --> D2["💡 Sugere Verbos Fortes (Liderei, Desenvolvi, Otimizei)"]
```

---

## 🗄️ Banco de Dados & Estrutura

O modelo E-R combina a velocidade relacional do PostgreSQL para índices de busca com a flexibilidade do JSON para o conteúdo do currículo:

```mermaid
erDiagram
    USER ||--o{ RESUME : "cria e gerencia"

    USER {
        string id PK "Identificador único do Clerk"
        string email UK "E-mail do usuário"
        string name "Nome completo"
    }

    RESUME {
        string id PK "UUID v4"
        string title "Nome do currículo"
        json content "Estrutura JSON do ResumeData"
        string locale "Idioma ('pt', 'en')"
        string colorTheme "Hex da cor temática"
        int views "Visualizações públicas"
        int downloads "Downloads de PDF"
        string userId FK "ID do usuário"
        string groupId "Agrupador de traduções"
        string slug UK "Link amigável único"
        datetime expiresAt "Data limite de expiração (Opcional)"
        int maxViews "Limite de visualizações (Opcional)"
        string[] sectionsOrder "Ordem de exibição das seções"
    }
```

---

## 🧪 Testes Automatizados (39 Testes)

O projeto conta com uma cobertura completa dividida em testes unitários e testes End-to-End no navegador:

```mermaid
flowchart LR
    subgraph Unit ["🧪 Vitest (24 Testes Unitários)"]
        U1["ResumeSchema Zod (12 testes)"]
        U2["ATS Validator (2 testes)"]
        U3["Keyword Matcher (3 testes)"]
        U4["Spellchecker (2 testes)"]
        U5["LanguageSwitcher (2 testes)"]
        U6["cn() Utility (3 testes)"]
    end

    subgraph E2E ["🎭 Playwright (15 Testes E2E)"]
        E1["Clerk Test Mode Auth"]
        E2["Rotas /pt e /en"]
        E3["Validação de Formulários"]
        E4["Inteligência ATS & Matcher"]
        E5["Backup JSON & PDF Pipeline"]
    end
```

### 🚀 Comandos de Execução

```bash
# Rodar suíte de testes unitários com Vitest
pnpm test

# Rodar suíte de testes E2E com Playwright
pnpm test:e2e

# Interface gráfica interativa do Playwright
pnpm test:e2e:ui
```

---

## 🏁 Inicialização Local

### 1. Clonar e Instalar

```bash
git clone https://github.com/gui-bus/Lume.git
cd Lume
pnpm install
```

### 2. Subir Banco de Dados com Docker

```bash
docker-compose up -d
pnpm prisma migrate dev
```

### 3. Rodar Aplicação

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📑 Documentação Técnica Adicional

Para uma imersão profunda em cada módulo da aplicação, consulte a pasta [`/docs`](file:///c:/Users/Guilherme/Desktop/PROJETOS/Lume/docs/README.md):

- 🚀 [**`docs/features.md`**](file:///c:/Users/Guilherme/Desktop/PROJETOS/Lume/docs/features.md): Mapa detalhado de todas as telas e componentes.
- 🏗️ [**`docs/architecture.md`**](file:///c:/Users/Guilherme/Desktop/PROJETOS/Lume/docs/architecture.md): Especificação do Next.js App Router, middleware e PDF Engine.
- 🗄️ [**`docs/database.md`**](file:///c:/Users/Guilherme/Desktop/PROJETOS/Lume/docs/database.md): Modelagem física e estratégia de JSON + PostgreSQL.
- ⚖️ [**`docs/business-rules.md`**](file:///c:/Users/Guilherme/Desktop/PROJETOS/Lume/docs/business-rules.md): Regras de pontuação ATS e dicionário de palavras-chave.
