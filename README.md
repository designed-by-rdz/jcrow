# JCrow
### **JSON Structure Tabulator**
**Version 0.5.0 (Beta)**

JCrow is a lightweight, high-performance desktop utility built with **Tauri v2** and **Vue.js**. It transforms "wall-of-text" JSON data into a clean, editable tabular interface, making data manipulation intuitive for developers and data analysts.

---

## Features

* **Tabular Visualization:** Instantly plot an array of objects into a structured data table.
* **Inline Editing:** Edit key-value pairs directly within the table cells.
* **Dual View:** A toggleable text viewer to see the raw JSON output side-by-side.
* **Native Performance:** Powered by Tauri v2 for a tiny footprint and system-native speed.

## Current Limitations

As this is an early-stage side project, please be aware of the following constraints:
* **Row Limit:** Currently optimized for files up to **500 rows**.
* **Schema Support:** Supports **flat arrays of objects** only (e.g., `[{ "id": 1, "name": "test" }]`).
* **Deep Nesting:** Editing of objects or arrays *inside* values is not yet supported.
* **Beta Stage:** The codebase is currently 100% Vue-based; a migration to Rust for core logic is planned.

---

## Tech Stack

* **Frontend:** [Vue.js 3](https://vuejs.org/) (Composition API)
* **Desktop Framework:** [Tauri v2](https://v2.tauri.app/)

---

## Installation & Setup

### Prerequisites
* [Rust & Cargo](https://www.rust-lang.org/tools/install)
* [Node.js](https://nodejs.org/) (LTS recommended)
* System dependencies for Tauri (see [Tauri's Prerequisites](https://v2.tauri.app/start/prerequisites/))

### Development
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/designed-by-rdz/jcrow.git](https://github.com/designed-by-rdz/jcrow.git)
    cd jcrow
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run in development mode:**
    ```bash
    npm run tauri dev
    ```

---

## Future Developments

This is just a side project for my game development and I consider it done for my current needs. I might update this in the future, when I have time, or when my current needs will not be met by the app. I might also try to learn Rust and migrate the codebase to the backend if it can make the app run faster. 

---

## Tentative Roadmap

- [ ] **Rust Core Migration:** Move data processing and file I/O to the Rust backend for better memory safety and speed.
- [ ] **Deep Nesting Support:** Enable recursive editing for nested objects and arrays.
- [ ] **Large Dataset Support:** Implement virtual scrolling to remove the 500-row cap.
- [ ] **Multi-Format Export:** Save edited data back to `.json`, `.csv`, or `.yaml`.

## License
Distributed under the GPL-3.0 License. See `LICENSE` for more information.

---
*app designed by rdz*