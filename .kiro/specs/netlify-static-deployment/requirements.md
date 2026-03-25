# Requirements Document

## Introduction

Refactor the Indecision App from an Express-served Node.js application into a pure static site deployable to Netlify. This involves removing the Express server dependency, updating the build pipeline to produce self-contained static assets, and adding Netlify-specific configuration so the app can be deployed and served directly from Netlify's CDN.

## Glossary

- **App**: The Indecision React application
- **Build_System**: The webpack 5 build pipeline that compiles and bundles the App
- **Express_Server**: The current Node.js/Express server in `server/server.js` that serves static files
- **Netlify**: The static hosting platform that will serve the App after deployment
- **Netlify_Config**: The `netlify.toml` configuration file that controls build and redirect settings
- **Static_Assets**: The compiled output files (HTML, JS, CSS, images) produced by the Build_System
- **SPA_Redirect**: A Netlify redirect rule that routes all requests to `index.html` to support client-side routing
- **Public_Dir**: The `public/` directory containing the compiled Static_Assets

## Requirements

### Requirement 1: Remove Express Server Dependency

**User Story:** As a developer, I want to remove the Express server from the project, so that the app has no runtime server dependency and can be hosted as a pure static site.

#### Acceptance Criteria

1. THE App SHALL NOT require the Express_Server to be running in order to serve Static_Assets to end users.
2. WHEN the project dependencies are installed, THE Build_System SHALL NOT require `express` as a runtime dependency.
3. THE `start` script in `package.json` SHALL be replaced with a script that serves Static_Assets using a static file server suitable for local development without Express.

---

### Requirement 2: Netlify Configuration

**User Story:** As a developer, I want a `netlify.toml` configuration file, so that Netlify knows how to build and serve the App correctly.

#### Acceptance Criteria

1. THE Netlify_Config SHALL specify the build command as the production webpack build.
2. THE Netlify_Config SHALL specify `public` as the publish directory containing Static_Assets.
3. THE Netlify_Config SHALL define a SPA_Redirect rule that redirects all URL paths to `/index.html` with a 200 status code, so that client-side routing works correctly on Netlify.

---

### Requirement 3: Self-Contained Static Build Output

**User Story:** As a developer, I want the webpack build to produce a fully self-contained set of static files, so that the output in `public/` can be deployed to Netlify without any server-side processing.

#### Acceptance Criteria

1. WHEN `npm run build:prod` is executed, THE Build_System SHALL produce all Static_Assets in the `public/` directory.
2. THE Build_System SHALL embed or reference all CSS styles within the Static_Assets such that no server-side rendering is required.
3. THE `public/index.html` file SHALL reference the compiled JavaScript bundle so the App loads correctly in a browser without a server.

---

### Requirement 4: Local Development Without Express

**User Story:** As a developer, I want to run the app locally without Express, so that my local development workflow matches the static hosting environment.

#### Acceptance Criteria

1. WHEN a developer runs the local development command, THE Build_System SHALL serve the App via `webpack-dev-server` on port 8080.
2. WHILE `webpack-dev-server` is running, THE Build_System SHALL support hot module replacement so changes are reflected without a full page reload.
3. IF a request is made to a route not matching a static file, THEN THE Build_System SHALL fall back to serving `index.html` to support client-side routing during development.

---

### Requirement 5: Dependency Cleanup

**User Story:** As a developer, I want `express` removed from the project dependencies, so that the production bundle and deployment environment are not bloated with unused server-side packages.

#### Acceptance Criteria

1. THE `package.json` SHALL NOT list `express` as a dependency after the refactor is complete.
2. THE `server/server.js` file SHALL be removed from the project.
3. WHEN `npm install` is run after the refactor, THE Build_System SHALL install only the packages required for building and running the static App.
