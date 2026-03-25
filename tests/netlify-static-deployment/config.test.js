const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');

// Feature: netlify-static-deployment, Property 1: No Express runtime dependency
test('Property 1: No Express runtime dependency', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const deps = pkg.dependencies || {};
  expect(deps).not.toHaveProperty('express');
  const startScript = pkg.scripts && pkg.scripts.start || '';
  expect(startScript).not.toMatch(/server\.js/);
});

// Feature: netlify-static-deployment, Property 2: netlify.toml build section is correct
test('Property 2: netlify.toml build section is correct', () => {
  const toml = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8');
  expect(toml).toContain('command = "npm run build:prod"');
  expect(toml).toContain('publish = "public"');
});

// Feature: netlify-static-deployment, Property 3: netlify.toml SPA redirect covers all paths
test('Property 3: netlify.toml SPA redirect covers all paths', () => {
  const toml = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8');
  expect(toml).toContain('from = "/*"');
  expect(toml).toContain('to = "/index.html"');
  expect(toml).toContain('status = 200');
});

// Feature: netlify-static-deployment, Property 4: webpack devServer config supports local static development
test('Property 4: webpack devServer config supports local static development', () => {
  const webpackConfig = require(path.join(root, 'webpack.config.js'));
  const { devServer } = webpackConfig;
  expect(devServer.port).toBe(8080);
  expect(devServer.hot).toBe(true);
  expect(devServer.historyApiFallback).toBe(true);
});
