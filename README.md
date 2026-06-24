## How to contribute to [areweglobalshortcutsyet.github.io](https://areweglobalshortcutsyet.github.io/)

1. **Fork** this repository.
2. **Edit** `tracker.json` with updated information or a new application.
3. **Commit** your changes with a brief description.
4. **Submit** a Pull Request for review.

Examples: [tracker-examples.json](https://github.com/AreWeGlobalShortcutsYet/areweglobalshortcutsyet.github.io/blob/main/tracker-examples.json).

### Example Entry
```json
"example-project": {
    "name": "Project Name",
    "url": "https://example.com/",
    "tracking_issue": "https://github.com/user/repo/issues/1",
    "pull_request": "https://github.com/user/repo/pr/1",
    "wip": false,
    "testing": false,
    "done": true,
    "declined": false
}
```

### About [GlobalShortcuts](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.GlobalShortcuts.html)

GlobalShortcuts is an XDG Desktop Portal implementation that enables applications on [Wayland](https://wayland.freedesktop.org/) to register and use global keyboard shortcuts. It allows apps to respond to specific key combinations without needing direct access to all user input events.

### Why this matters

Currently, some applications circumvent sandboxing and Wayland security defaults by requesting full input monitoring permissions instead of using GlobalShortcuts. This forces users to choose between application functionality and security. We want to track application support for the portal to highlight when developers move toward a secure "least privilege" model and support OS defaults.