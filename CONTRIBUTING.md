# Contributing to Contractly

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/contracts.git
   cd contracts
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes

3. Test your changes:
   ```bash
   npm run build
   npm run preview
   ```

4. Check TypeScript types:
   ```bash
   npm run check
   ```

5. Commit your changes (see [Commit Guidelines](#commit-guidelines))

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request

## Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Use Svelte best practices (see `SVELTE_CLEAN_CODE_REVIEW.md`)
- Keep components focused and under 200-300 lines
- Avoid code duplication

## Commit Guidelines

Write clear, descriptive commit messages:

```
feat: add export to CSV functionality
fix: correct date calculation for cancellation deadlines
docs: update README with new features
refactor: simplify contract validation logic
```

Use conventional commit prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Pull Request Process

1. Update documentation if needed
2. Ensure your code builds successfully (`npm run build`)
3. Test your changes locally
4. Write a clear PR description explaining:
   - What changes you made
   - Why you made them
   - How to test them
5. Link any related issues

## Reporting Issues

When reporting bugs or requesting features:

- Use the GitHub issue tracker
- Provide a clear description
- Include steps to reproduce (for bugs)
- Specify your environment (browser, OS, etc.)

## Questions?

Feel free to open an issue for questions or discussions about the project.

Thank you for contributing! 🎉
