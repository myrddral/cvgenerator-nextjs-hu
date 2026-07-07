<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## Project Context

- Node.js is not installed, for the current runtime, package manager or other useful scripts refer to the package.json file
- Don't write comments for things that can easily understood from the code at hand. Exceptions from this are when you write utilities to be imported into larger modules,
  then add JSDoc and clarify the purpose
- Middleware file is named `proxy.ts` (not the conventional `middleware.ts`)

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision
- At the end of each plan, give me a list of unresolved questions to answer, if any

## Next.js Conventions

- Files with `'use server'` directive must only export async functions — never re-export types from them
- Public env vars need the `NEXT_PUBLIC_` prefix; check before assuming a variable is available client-side
