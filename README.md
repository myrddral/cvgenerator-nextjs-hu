## CV Generator

The project's goal is to enable the user to input their relevant data then generate a nicely formatted CV which they can download as PDF. The initial release version will support Hungarian language only, extension to other select langauges planned to be implemented in later versions.

# Planned Features
[] Data input via a multi-step form incl. client-side validation
[] PDF document generation from the input
[] Choice of custom accent colors for the CV
[] Option to save, recall or edit CV data (client side storage)
[] Authentication & user accounts
[] Option to save, list, recall or edit CV's (database storage)

# Technologies / packages
* Language: TypeScript
* Framework: Next.js 14 with App router
* Form state management: React Hook Form
* Data validation: Zod
* Internalization: next-intl
* UI: radix-ui | shadcn/ui | mantine
* Styling: TailwindCSS
* Authentication: Firestore
* Database: PostgreSQL
* Data access layer: Prisma
* Tests: react-testing-library and Jest