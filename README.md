# CV Generator

The project's goal is to enable the user to input their relevant data then generate a nicely formatted CV which they can download as PDF. The initial release version will support Hungarian language only, extension to other select langauges planned to be implemented in later versions.

## Technologies / packages
* Language: [TypeScript](https://www.typescriptlang.org/)
* Framework: [Next.js](https://nextjs.org/) with App router
* Form state management: [React Hook Form](https://react-hook-form.com/)
* Data validation: [Zod](https://zod.dev/)
* Internalization: [next-intl](https://next-intl-docs.vercel.app/)
* UI: [radix-ui](https://www.radix-ui.com/) | [shadcn/ui](https://ui.shadcn.com/) | [Mantine](https://mantine.dev/)
* Styling: [TailwindCSS](https://tailwindcss.com/)
* Authentication: [Next-Auth](https://next-auth.js.org/)
* Database: [PostgreSQL](https://www.postgresql.org/)
* Data access layer: [Prisma](https://www.prisma.io/)
* PDF templates: [React PDF](https://react-pdf.org/)
* Tests: [Testing Library](https://testing-library.com/) and [Jest](https://jestjs.io/)

## Planned Features for v1.0
- [x] Data input via a multi-step form incl. client-side validation
- [x] PDF document generation from the input
- [ ] Choice of custom accent colors for the CV
- [ ] Option to save, recall or edit CV data (client side storage)
- [ ] Authentication & user accounts
- [ ] Option to save, list, recall or edit CV's (database storage)
