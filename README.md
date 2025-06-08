# The Awesome Suspender

A modern Chrome extension that automatically suspends inactive tabs to save memory and CPU usage. Built with privacy and performance in mind, this extension helps manage browser resources effectively while ensuring user data remains secure.

## Background

This extension is an open-source successor to:
- **The Great Suspender** - A popular tab suspension extension that was unfortunately compromised when sold to a third party who inserted problematic code.
- **The Marvellous Suspender** - A trusted alternative that reached end-of-life as Chrome transitions to Manifest V3.

The Awesome Suspender is built from the ground up using Manifest V3, incorporating the best features of its predecessors while maintaining a strong focus on security, privacy, and code transparency.

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
