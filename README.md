# 🌌 LendSwift Multi-Step Loan Application Portal

**LendSwift** is a production-grade, 8-step digital lending wizard designed to streamline the loan application experience for three distinct borrowing categories: **Personal**, **Home**, and **Business** loans.

The portal is styled with the custom **Aether Luxe** theme—an ultra-premium dark-mode glassmorphism design featuring amethyst violet highlights, emerald mint feedback indicators, and high-performance interactive controls.

---

## 🎨 Design System: "Aether Luxe"
LendSwift features a luxurious, high-contrast dark aesthetic that strictly avoids dull corporate blue:
*   **Palette:** Rich Amethyst Violet (`#8B5CF6`) as primary branding, with Emerald Mint (`#10B981`) for successful states and badging.
*   **Atmosphere:** Glassmorphic layout panels (`backdrop-filter: blur(16px)`) with glowing plum borders (`#2E1E4E`) styled over a deep space background gradient.
*   **Typography:** The clean and modern **Plus Jakarta Sans** Google Font family.
*   **Micro-Animations:** Fluid transformations on buttons, glowing inputs on focus, and interactive state triggers for high engagement.

---

## 🚦 Form Steps & User Flows

LendSwift consists of a logical, validation-secured 8-step progression:
1.  **Loan Selection:** Choose Personal, Home, or Business loan types with dynamic interest rates, bounds, and purpose menus.
2.  **Personal Information:** Validates essential contact details, age restrictions, and formats.
3.  **KYC Verification:** Live simulated validation of Indian PAN and Aadhaar numbers (utilizing Aadhaar Verhoeff checksum algorithms).
4.  **Address Details:** Dual address management with permanent PIN code lookup autocompletion (resolving to City and State).
5.  **Employment & Income:** Collects career details, monthly income, and existing EMIs.
6.  **Co-Applicant Details:** Conditional step that prompts for co-borrower details (only triggers for Home loans or high-value Personal/Business loans).
7.  **Document Upload:** Drag-and-drop secure file upload featuring canvas-based image compression and a HTML5 canvas signature pad.
8.  **Review & Submit:** Displays a live pre-approval EMI math breakdown, RBI digital lending grievance disclaimers, and cooling-off period notices before encryption.

---

## 🔒 Technical Standards & Security

*   **State Persistence & Encryption:** Automatically auto-saves form progress to local storage. Sensitive PII (Personally Identifiable Information) data is securely encrypted using **AES-256-GCM** cryptography via the browser's native **Web Crypto API**.
*   **Validation Architecture:** Powered by **React Hook Form** and **Zod** schema resolvers. Ensures real-time inline validation, formatting, and correct field mappings.
*   **RBI Regulatory Compliance:** Includes direct grievance redressal pathways, RBI Ombudsman disclosures, and details for the mandatory 3-day Cooling-Off period.

---

## 📂 Project Structure

```
loan-application/
├── cypress/                # E2E test suites with Cypress
├── src/
│   ├── assets/             # Brand logos and global assets
│   ├── components/
│   │   └── steps/          # Step 1 to Step 8 React form components
│   ├── context/            # FormContext managing reducer states
│   ├── hooks/              # Custom hooks (e.g., encryption & auto-save)
│   ├── utils/              # Helper utilities, constants, and validation schemas
│   ├── App.jsx             # Main portal container & wizard frame
│   ├── index.css           # Tailwind CSS directives & global Aether Luxe classes
│   └── main.jsx            # Application entrypoint
├── cypress.config.js       # Cypress environment settings
├── eslint.config.js        # Code standards and lint configurations
├── index.html              # HTML shell & font injections
├── package.json            # NPM dependencies & build scripts
└── vite.config.js          # Vite build configuration
```

---

## 🚀 Local Setup & Installation

Follow these steps to run the LendSwift portal locally:

### 1. Install Dependencies
Ensure you have Node.js installed, then execute:
```bash
npm install
```

### 2. Launch Local Server
Start the high-performance Vite dev server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 3. Production Build
Verify optimization, bundling, and CSS asset outputs:
```bash
npm run build
```

### 4. Run E2E Test Suite
To verify step behaviors, dynamic validations, and auto-saves:
```bash
# To run headlessly:
npm run cypress:run

# To run interactively:
npm run cypress:open
```
