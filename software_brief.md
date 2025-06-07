Here’s a structured and detailed **Product Brief** that you can use to feed into an AI code generator for building *The Awesome Suspender*, a modern Chrome extension:

---

## Product Brief: **The Awesome Suspender**

### Overview:

**The Awesome Suspender** is a modern, privacy-focused, and resource-efficient Chrome extension that automatically suspends inactive tabs to save memory and CPU. It is a spiritual successor and safe replacement for the now-obsolete *Marvellous Suspender* and *The Great Suspender*, built using the latest Chrome Extension Manifest (v3).

---

### Core Features:

#### 🔄 Automatic Tab Suspension

* Suspend inactive tabs after a user-configurable interval (default: 30 minutes).
* Refresh or use browser history navigation to resume suspended tabs.
* Uses a lightweight `suspended.html` page displaying a sleeping version of the plugin mascot.

#### 🛠 Settings (Configurable via Options Page)

* **Auto-suspend timeout**: 30 mins (default)
* **Whitelist rules**:

  * Never suspend:

    * Pinned tabs
    * Tabs with unsaved form inputs
    * Tabs playing audio
    * Active tabs per window
    * Tabs when offline
    * Tabs when on power source
    * Tabs matching user-defined URLs (new line-separated list)
* **Other settings**:

  * Automatically unsuspend tab when viewed
  * Apply Chrome's memory-saving (discard API toggle)
  * Claim suspended tabs by default (`suspended.html` pattern matching)
  * Theme: light / dark
  * Add context menu items
  * Sync settings via Chrome profile
  * Instant suspend if system memory is very low

---

### 🖱️ Keyboard Shortcuts (Default + Configurable):

* `Ctrl+Shift+U`: Suspend/Unsuspend active tab
* Customizable shortcuts for:

  * Pause/unpause suspension
  * Suspend/unsuspend selected tabs
  * Suspend/unsuspend all tabs in current window
  * Force suspend all in current window
  * Suspend/unsuspend all in all windows

---

### 🗂️ Session Manager UI:

* Displays current session as a collapsible list.
* Each session shows number of windows and tabs (in subtle color).
* Expanding a window reveals tab list:

  * Tab info includes favicon + title (linked to tab’s URL)
  * Each tab includes Suspend/Unsuspend action
* **Modern UI with collapsible panels**, dark/light themes
* Sessions and tabs can be exported individually

---

### 🕓 Session History:

* 30-day session backup history (collapsed by default)
* Daily backup at 12:00 AM (local time)
* Automatically deletes oldest backup when exceeding 30
* Stored securely using **IndexedDB**

---

### 💤 Suspended Page:

* Lightweight `suspended.html` with plugin mascot (sleeping tab with suspenders)
* Clicking mascot switches to "awake" state
* Wait 3 seconds, then automatically go back using browser’s `history.back()` or `history.go(-1)`

---

### 🔌 Technologies and APIs:

* **Manifest v3** (latest Chrome extension standard)
* **IndexedDB** for session data
* **chrome.storage.sync** for settings sync
* **chrome.contextMenus** for right-click features
* **chrome.sessions** and **chrome.tabs** for tab management
* **Optional** use of **chrome.discard API** for native memory-saving

---

### Mascot Design:

* A browser tab icon with:

  * Closed eyes (sleeping), a nose, and humanoid lower body
  * Wearing suspenders
  * Clicking toggles to awake form (open eyes, smile)

---

### Permissions Required:

* `tabs`, `sessions`, `storage`, `contextMenus`, `scripting`, `activeTab`
* `host_permissions`: `<all_urls>` (for tab access and suspension logic)

---

### 🧭 Menus and Shortcuts

#### 📋 Keyboard Shortcuts

All available keyboard shortcuts are also accessible via the plugin’s context menu. Default shortcuts include:

* **Suspend/Unsuspend active tab**: `Ctrl + Shift + U`
* Additional actions (customizable via Chrome shortcut settings):

  * Pause/Unpause suspension of active tab
  * Suspend selected tabs
  * Unsuspend selected tabs
  * Suspend all other tabs in active window
  * Force suspend all other tabs in active window
  * Unsuspend all tabs in active window
  * Suspend all tabs in all windows
  * Force suspend all tabs in all windows
  * Unsuspend all tabs in all windows

#### 🖱️ Right-Click Context Menu

When right-clicking on any webpage, a context menu section titled **The Awesome Suspender** provides the following actions:

* **Suspend/Unsuspend this tab**
* **Pause/Unpause suspension of this tab**
* **Never suspend this URL**
* **Never suspend this domain**

---

* **Suspend selected tabs**
* **Unsuspend selected tabs**

---

* **Suspend all other tabs in this window**
* **Force suspend all other tabs in this window**
* **Unsuspend all tabs in this window**

---

* **Suspend all tabs in all windows**
* **Force suspend all tabs in all windows**
* **Unsuspend all tabs in all windows**

Menu sections are visually separated using standard submenu dividers (represented above with `---`).



This brief is structured to enable a code generator to build:

* A full-featured Chrome extension
* A dynamic options/settings UI
* A modern popup and suspended-tab UX
* Background logic for tab/session management


