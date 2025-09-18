# battleships

Demo project for a one-sided game of battleships.

To debug, enter toggleDebug() in the console to see the location of the ships

Improvements

- max number of shots
- timer
- ensure a minimum of 1 square gap between ships
- configuration (number of ships, cols/rows etc)
- allow diagonals
- ensure that there's at least one ship in a different orientation
- 2 player
- websockets for 2 player
- e2e testing

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
