const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
  },
});
