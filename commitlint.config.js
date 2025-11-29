/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of the following
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only changes
        'style', // Changes that don't affect code meaning (formatting, etc.)
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf', // Performance improvement
        'test', // Adding or correcting tests
        'build', // Changes to build system or dependencies
        'ci', // CI/CD configuration changes
        'chore', // Other changes that don't modify src or test files
        'revert', // Reverts a previous commit
      ],
    ],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Type cannot be empty
    'type-empty': [2, 'never'],
    // Subject cannot be empty
    'subject-empty': [2, 'never'],
    // Subject must not end with period
    'subject-full-stop': [2, 'never', '.'],
    // Subject max length
    'subject-max-length': [2, 'always', 100],
    // Header max length
    'header-max-length': [2, 'always', 100],
    // Body max line length
    'body-max-line-length': [2, 'always', 200],
    // Footer max line length
    'footer-max-line-length': [2, 'always', 200],
  },
};
