const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');

// Feature: netlify-static-deployment, Property 5: index.html references the compiled bundle
test('index.html references the compiled bundle', () => {
  const html = fs.readFileSync(path.resolve(root, 'public/index.html'), 'utf8');
  expect(html).toMatch(/<script[^>]*bundle\.js/);
});

// Feature: netlify-static-deployment, Property 6: server.js is absent
test('server.js is absent', () => {
  expect(fs.existsSync(path.resolve(root, 'server/server.js'))).toBe(false);
});

// Feature: netlify-static-deployment, Property 7: Production build emits bundle to public/
test('production build emits bundle to public/', () => {
  expect(fs.existsSync(path.resolve(root, 'public/bundle.js'))).toBe(true);
  expect(fs.existsSync(path.resolve(root, 'public/index.html'))).toBe(true);
});
