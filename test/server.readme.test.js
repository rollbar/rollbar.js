import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from 'chai';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

/**
 * Return the README's Session Replay section: its `##` heading line plus
 * everything up to the next `##` heading, or null when there is none.
 *
 * @param {string} readme
 * @returns {string | null}
 */
function sessionReplaySection(readme) {
  const lines = readme.split('\n');
  const start = lines.findIndex((line) => /^## Session Replay\b/.test(line));
  if (start === -1) {
    return null;
  }
  const next = lines.findIndex(
    (line, i) => i > start && line.startsWith('## '),
  );
  return lines.slice(start, next === -1 ? undefined : next).join('\n');
}

describe('README', function () {
  const readme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8');

  describe('Session Replay section', function () {
    const section = sessionReplaySection(readme);

    it('exists under a plain "Session Replay" heading', function () {
      expect(section, 'no "## Session Replay" section in README.md').to.be.a(
        'string',
      );
      expect(section.split('\n')[0]).to.equal('## Session Replay');
    });

    // Session Replay is generally available; the README called it beta long
    // after that stopped being true.
    it('does not describe Session Replay as beta', function () {
      expect(section).to.not.match(/\bbeta\b/i);
    });

    it('still points readers to the rollbar/replay bundle', function () {
      expect(section).to.include("import Rollbar from 'rollbar/replay';");
    });
  });
});
