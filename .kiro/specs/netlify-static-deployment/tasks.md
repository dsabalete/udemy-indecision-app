# Implementation Plan: Netlify Static Deployment

## Overview

Remove the Express server, add Netlify configuration, and update the webpack/package.json config so the app builds and serves as a pure static site.

## Tasks

- [x] 1. Add netlify.toml
  - Create `netlify.toml` in the project root with a `[build]` section and a `[[redirects]]` SPA catch-all rule
  - `command = "npm run build:prod"`, `publish = "public"`
  - Redirect: `from = "/*"`, `to = "/index.html"`, `status = 200`
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Update webpack.config.js devServer
  - Add `historyApiFallback: true` and `hot: true` to the existing `devServer` block
  - No other changes to entry, output, loaders, or production config
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 3. Update package.json
  - Remove `express` from `dependencies`
  - Replace `"start": "node server/server.js"` with `"start": "webpack serve --mode development"` (or remove it — `dev-server` already covers local dev)
  - Remove the `heroku-postbuild` script
  - _Requirements: 1.2, 1.3, 5.1_

- [x] 4. Delete server/server.js
  - Remove the file `server/server.js` from the project
  - _Requirements: 5.2_

- [ ] 5. Write config tests (Properties 1–4)
  - [x] 5.1 Create `tests/netlify-static-deployment/config.test.js`
    - Read files from disk and assert on their contents — no mocking required
    - _Requirements: 1.2, 1.3, 2.1, 2.2, 2.3, 4.1, 4.2, 4.3, 5.1_

  - [ ]* 5.2 Write test for Property 1: No Express runtime dependency
    - `// Feature: netlify-static-deployment, Property 1: No Express runtime dependency`
    - Assert `package.json` `dependencies` does not contain `express`
    - Assert `start` script does not reference `server.js`
    - **Validates: Requirements 1.2, 1.3, 5.1**

  - [ ]* 5.3 Write test for Property 2: netlify.toml build section is correct
    - `// Feature: netlify-static-deployment, Property 2: netlify.toml build section is correct`
    - Parse `netlify.toml` and assert `command = "npm run build:prod"` and `publish = "public"`
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 5.4 Write test for Property 3: netlify.toml SPA redirect covers all paths
    - `// Feature: netlify-static-deployment, Property 3: netlify.toml SPA redirect covers all paths`
    - Assert a `[[redirects]]` entry exists with `from = "/*"`, `to = "/index.html"`, `status = 200`
    - **Validates: Requirements 2.3**

  - [ ]* 5.5 Write test for Property 4: webpack devServer config supports local static development
    - `// Feature: netlify-static-deployment, Property 4: webpack devServer config supports local static development`
    - Require `webpack.config.js` and assert `devServer.port === 8080`, `devServer.hot === true`, `devServer.historyApiFallback === true`
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [ ] 6. Write output tests (Properties 5–7)
  - [x] 6.1 Create `tests/netlify-static-deployment/output.test.js`
    - File-system assertions for build output and deleted files — no mocking required
    - _Requirements: 3.1, 3.3, 5.2_

  - [ ]* 6.2 Write test for Property 5: index.html references the compiled bundle
    - `// Feature: netlify-static-deployment, Property 5: index.html references the compiled bundle`
    - Read `public/index.html` and assert it contains a `<script` tag referencing `bundle.js`
    - **Validates: Requirements 3.3**

  - [ ]* 6.3 Write test for Property 6: server.js is absent
    - `// Feature: netlify-static-deployment, Property 6: server.js is absent`
    - Assert `fs.existsSync('server/server.js')` returns `false`
    - **Validates: Requirements 5.2**

  - [ ]* 6.4 Write test for Property 7: Production build emits bundle to public/
    - `// Feature: netlify-static-deployment, Property 7: Production build emits bundle to public/`
    - Assert `public/bundle.js` exists and `public/index.html` exists
    - **Validates: Requirements 3.1, 3.2**

- [x] 7. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster pass
- Properties 5–7 in `output.test.js` assert on files that exist after a build run — run `npm run build:prod` before executing those tests
- Run config tests at any time: `npm test -- -t "netlify-static-deployment"`
- No property-based testing library needed — all checks are deterministic structural assertions
