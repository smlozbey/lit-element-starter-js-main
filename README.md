# Employee Management App (LitElement JS)

This is a fictional HR employee management web application built using [LitElement](https://lit.dev) JavaScript.

## 🚀 Features

- View, add, edit, and delete employee records
- List & table views with pagination and search
- Responsive design (no CSS frameworks used)
- Routing via Vaadin Router
- Localization support for Turkish 🇹🇷 and English
- State management (client-side only)
- Confirmation dialogs for edits & deletions
- Unit tests with high code coverage (85%+)

## 🔧 Technologies Used

- LitElement (JavaScript)
- Vaadin Router
- Custom State Store
- Vanilla CSS

## 📦 Getting Started

```bash
git clone https://github.com/smlozbey/lit-element-starter-js-main.git
cd employee-management-lit
npm install
npm run serve
```

## 🧪 Running Tests

```bash
npx playwright install
npm run test
```
OR
```bash
npm run test -- --coverage
```
OR
```bash
npm run coverage
```

## 🌐 Localization

```html
<html lang="tr"> <!-- or "en" -->
```