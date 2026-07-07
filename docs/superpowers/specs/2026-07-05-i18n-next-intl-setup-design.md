# next-intl setup (GH #34, foundation for #16)

## Goal

Wire up next-intl so app supports en (default) + hu, URL-routed. Full string replacement across app is a separate follow-up (rest of #16).

## Scope

- `app/[locale]/` routing via next-intl middleware, locales `["en","hu"]`, default `en`.
- Middleware redirects `/` based on cookie/`Accept-Language`.
- `i18n/routing.ts`, `i18n/request.ts`, `messages/en.json`, `messages/hu.json` (empty/minimal to start — real content lands in follow-up pass).
- `NextIntlClientProvider` in `app/[locale]/layout.tsx`.
- `siteConfig.htmlLang` / `siteConfig.locale` derived from route locale, not hardcoded.
- Navbar locale switcher (dropdown/toggle next to theme toggle), preserves current path on switch.
- `template001.tsx`: `locale` becomes a prop (from URL param) instead of hardcoded `"hu"`. Keep existing `translations.ts` plain-object pattern for react-pdf content — do not attempt next-intl context inside react-pdf's renderer (untested/risky, react-pdf uses its own reconciler).

## Out of scope

- Replacing hardcoded strings in navbar, footer, forms, buttons, loaders, page copy — later pass.
- date-fns `hu` locale in `form-generator/field-factory-wrapper.tsx` — later pass.

## Migration note

All existing routes (`/`, `/show`, `/privacy`, `/terms`, `/attribution`, `/dev`, `/create/[section]`) move under `app/[locale]/`.

## Open questions

None outstanding — decisions above confirmed with user.
