# Project Directory Structure

This file outlines the structure of the `Custom-Browser-Homepage-2` repository after organizing source files under `src/` and migrating to TypeScript.

```text
Custom-Browser-Homepage-2/
├── assets/
│   ├── Favicon/
│   │   ├── about.txt
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon.ico
│   │   └── site.webmanifest
│   └── images/
│       ├── Astronomy.webp
│       ├── Clouds.webp
│       ├── Dessert.webp
│       ├── Horizon.webp
│       ├── Japan.webp
│       ├── Mountain.webp
│       ├── Mountain_2.webp
│       ├── Mountain_3.webp
│       ├── Scenery.webp
│       ├── Shapes.webp
│       ├── Shore.webp
│       ├── Shore_2.webp
│       ├── Stars.webp
│       ├── Stocks.webp
│       └── Study.webp
├── src/
│   ├── css/
│   │   ├── layout.css
│   │   └── design/
│   │       ├── ConditionalUI/
│   │       │   ├── Background.css
│   │       │   ├── ShortcutModal.css
│   │       │   ├── SlideBar.css
│   │       │   └── Widgets/
│   │       │       ├── News.css
│   │       │       ├── Quran.css
│   │       │       ├── RSS.css
│   │       │       └── Weather.css
│   │       ├── GlobalUI/
│   │       │   ├── Buttons.css
│   │       │   └── global.css
│   │       └── PersistentUI/
│   │           ├── Clock.css
│   │           ├── HelloUser.css
│   │           ├── Notes.css
│   │           └── SearchBar.css
│   ├── js/
│   │   ├── Global/
│   │   │   ├── ApiRouter.js
│   │   │   └── ToolTip.ts
│   │   ├── LeftColumn/
│   │   │   └── Shortcuts.ts
│   │   ├── MainContentArea/
│   │   │   ├── Non-Togglable/
│   │   │   │   ├── Clock.ts
│   │   │   │   ├── HelloUser.ts
│   │   │   │   ├── Notes.ts
│   │   │   │   └── SearchBar.ts
│   │   │   └── Togglable/
│   │   │       ├── News.ts
│   │   │       ├── Quran.ts
│   │   │       ├── RSS.ts
│   │   │       └── Weather.ts
│   │   └── RightColumn/
│   │       ├── BackendToggleBtn.ts
│   │       ├── Slidebar/
│   │       │   ├── Background.ts
│   │       │   ├── ClearLocalStorage.js
│   │       │   ├── SlideBar.ts
│   │       │   ├── WidgetToggle.ts
│   │       │   └── layoutChanger.ts
│   │       └── ThemeToggleBtn.ts
│   └── globals.d.ts
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── STRUCTURE.md
```