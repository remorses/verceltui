// E2E tests for search-deployments using hardcoded demo data.
// Validates list rendering, navigation, search filtering, and status icons.

import { test, expect, beforeEach, afterEach } from 'vitest'
import { launchTerminal, Session } from 'tuistory/src'

let session: Session

beforeEach(async () => {
  session = await launchTerminal({
    command: 'bun',
    args: ['src/search-deployments-demo.tsx'],
    cols: 90,
    rows: 25,
    cwd: __dirname + '/..',
  })
})

afterEach(() => {
  session?.close()
})

test('list shows deployments after loading', async () => {
  const text = await session.text({
    waitFor: (t) => t.includes('dark mode'),
    timeout: 10000,
  })
  expect(text).toMatchInlineSnapshot(`
    "


       Vercel Deployments ─────────────────────────────────────────────────────────────────

       > Search Deployments...

      ›● f...e my-app         Ready      5m ago  │ my-app                                 ▲
       ● f...t my-app         Building   30m ago │ feat: add dark mode toggle             █
       ● c...s docs-site      Failed     2h ago  │                                        █
       ● p...s api-service    Ready      1d ago  │ Project: my-app                        ▀
       ● N...e landing-page   Canceled   3d ago  │
                                                 │ Status:  Ready
                                                 │
                                                 │ Target:  production
                                                 │
                                                 │ ──────────────────────────────────────
                                                 │
                                                 │ Branch:  main
                                                 │
                                                 │ Created: 7/17/2026, 12:11:53 PM
                                                 │
                                                 │ Author:  tommy
       ↵ open deployment   ↑↓ navigate   ^k acti │                                        ▼

    "
  `)
  expect(text).toContain('dark mode')
  expect(text).toContain('my-app')
}, 15000)

test('navigate between deployments with arrow keys', async () => {
  await session.text({
    waitFor: (t) => t.includes('dark mode'),
    timeout: 10000,
  })

  await session.press('down')
  const afterDown = await session.text()
  expect(afterDown).toMatchInlineSnapshot(`
    "


       Vercel Deployments ─────────────────────────────────────────────────────────────────

       > Search Deployments...

       ● f...e my-app         Ready      5m ago  │ my-app                                 ▲
      ›● f...t my-app         Building   30m ago │ fix: resolve login timeout             █
       ● c...s docs-site      Failed     2h ago  │                                        █
       ● p...s api-service    Ready      1d ago  │ Project: my-app                        ▀
       ● N...e landing-page   Canceled   3d ago  │
                                                 │ Status:  Building
                                                 │
                                                 │ Target:  staging
                                                 │
                                                 │ ──────────────────────────────────────
                                                 │
                                                 │ Branch:  fix/login-timeout
                                                 │
                                                 │ Created: 7/17/2026, 11:46:53 AM
                                                 │
                                                 │ Author:  tommy
       ↵ open deployment   ↑↓ navigate   ^k acti │                                        ▼

    "
  `)
  expect(afterDown).toContain('login timeout')

  await session.press('down')
  const afterTwoDown = await session.text()
  expect(afterTwoDown).toMatchInlineSnapshot(`
    "


       Vercel Deployments ─────────────────────────────────────────────────────────────────

       > Search Deployments...

       ● f...e my-app         Ready      5m ago  │ docs-site                              ▲
       ● f...t my-app         Building   30m ago │ chore: update dependencies             █
      ›● c...s docs-site      Failed     2h ago  │                                        █
       ● p...s api-service    Ready      1d ago  │ Project: docs-site                     ▀
       ● N...e landing-page   Canceled   3d ago  │
                                                 │ Status:  Failed
                                                 │
                                                 │ Target:  preview
                                                 │
                                                 │ ──────────────────────────────────────
                                                 │
                                                 │ Branch:  chore/deps
                                                 │
                                                 │ Created: 7/17/2026, 10:16:53 AM
                                                 │
                                                 │ Author:  alice
       ↵ open deployment   ↑↓ navigate   ^k acti │                                        ▼

    "
  `)
  expect(afterTwoDown).toContain('update dependencies')
}, 15000)

test('search filters deployments', async () => {
  await session.text({
    waitFor: (t) => t.includes('dark mode'),
    timeout: 10000,
  })

  await session.type('optimize')
  const filtered = await session.text({
    waitFor: (t) => t.includes('optimize'),
  })
  expect(filtered).toMatchInlineSnapshot(`
    "


       Vercel Deployments ─────────────────────────────────────────────────────────────────

       > optimize

      ›● p...s api-service    Ready      1d ago  │ api-service                            ▲
                                                 │ perf: optimize database queries        █
                                                 │                                        █
                                                 │ Project: api-service                   ▀
                                                 │
                                                 │ Status:  Ready
                                                 │
                                                 │ Target:  production
                                                 │
                                                 │ ──────────────────────────────────────
                                                 │
                                                 │ Branch:  main
                                                 │
                                                 │ Created: 7/16/2026, 12:16:54 PM
                                                 │
                                                 │ Author:  tommy
       ↵ open deployment   ↑↓ navigate   ^k acti │                                        ▼

    "
  `)
  expect(filtered).toContain('optimize')
  expect(filtered).toContain('api-service')
}, 15000)
