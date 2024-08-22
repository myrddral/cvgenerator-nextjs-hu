# cv/gen - a resume generator

### Work in progress but the main functionality is already implemented:

- a multi-step form incl. client-side validation for data input
- PDF document generation from the input data on the client side
- session storage for data persistence to enable moving between steps without losing the data

#### Disclaimer: I started this project for the purpose of developing a tool primarily intended for my own use (for now) in order to easily create and edit resumes as well as having some real public code in my repo to showcase my coding skills (or lack thereof). 😁

Currently there are some fields which can't be hidden yet, and have no good use to anyone other than developers. However the project's long term goal is to enable all users to input their relevant data, then generate a nicely formatted resume tailored to the type of job they are applying for, which they can download as PDF. The current live version supports Hungarian language only for now, but it is planned to include an English version too before the v1.0 release and other select langauges in later ones.

#### 👉 [Live deployment on Vercel](https://cv-generator-frontend.vercel.app/)

## Planned technologies / packages to be used

🔹⇢ utilized 🔸⇢ planned

- Language: [TypeScript](https://www.typescriptlang.org/) 🔹
- Framework: [Next.js](https://nextjs.org/) with App router 🔹
- Form state management: [React Hook Form](https://react-hook-form.com/) 🔹
- Data validation: [Zod](https://zod.dev/) 🔹
- State management: [Zustand](https://zustand.dev/) 🔹
- Data Fetching: [TanStack Query](https://tanstack.com/query) 🔸
- Internalization: [next-intl](https://next-intl-docs.vercel.app/) 🔸
- UI: [radix-ui](https://www.radix-ui.com/) | [shadcn/ui](https://ui.shadcn.com/) | [Mantine](https://mantine.dev/) 🔹
- Styling: [TailwindCSS](https://tailwindcss.com/) 🔹
- Authentication: [Next-Auth](https://next-auth.js.org/) 🔸
- Database: [PostgreSQL](https://www.postgresql.org/) 🔸
- Data access layer: [Prisma](https://www.prisma.io/) 🔸
- PDF templates: [React PDF](https://react-pdf.org/) 🔹
- Tests: [Testing Library](https://testing-library.com/) and [Jest](https://jestjs.io/) 🔸

## Planned Features for v1.0

- [x] Data input via a multi-step form incl. client-side validation
- [x] PDF document generation from the input
- [ ] Choice of custom accent colors for the CV
- [ ] Option to save, recall or edit CV data (client side storage)
- [ ] Authentication & user accounts
- [ ] Option to save, list, recall or edit CV's (database storage)
