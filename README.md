# The Awesome Suspender

A modern, privacy-focused Chrome extension that automatically suspends inactive tabs to save memory and CPU. Built with Manifest V3.

## Features

- 🔄 Automatic tab suspension after configurable inactivity period
- 🛡️ Smart suspension rules:
  - Never suspends pinned tabs
  - Protects tabs with unsaved form inputs
  - Respects tabs playing audio
  - Keeps active tabs running
  - Works offline
  - URL whitelist support
- ⌨️ Keyboard shortcuts for quick actions
- 🎨 Light/Dark theme support
- 📊 Session management with 30-day history
- 🔍 Context menu integration
- 🔄 Chrome sync support for settings

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` directory

## Development

- Run in development mode with auto-reload:
  ```bash
  npm run dev
  ```
- Run tests:
  ```bash
  npm test
  ```
- Run linting:
  ```bash
  npm run lint
  ```

## Default Keyboard Shortcuts

- `Ctrl+Shift+U`: Suspend/Unsuspend active tab
- Additional shortcuts can be configured in Chrome's keyboard shortcuts settings

## License

MIT License
