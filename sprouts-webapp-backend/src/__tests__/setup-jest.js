test.todo("dummy");

global.console = {
  /* eslint-disable-next-line no-console */
  log: console.log,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
