#!/usr/bin/env node

/**
 * Updates Rollbar snippet in example files (js and html)
 * Replaces content between "// Rollbar Snippet" and "// End Rollbar Snippet"
 * markers
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import glob from 'glob';

async function updateSnippets() {
  console.log('Updating Rollbar snippet in example files...');
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
  const snippetPath = path.join(root, 'dist/rollbar.snippet.js');
  const snippet = await readFile(snippetPath, 'utf8');
  const regex =
    /^([ \t]*)(\/\/ Rollbar Snippet\n)(.*?)(\n[ \t]*\/\/ End Rollbar Snippet)$/ms;

  const files = glob.sync('examples/**/*.{html,js}', {
    cwd: root,
    absolute: true,
  });

  for (const file of files) {
    const content = await readFile(file, 'utf8');

    let didReplace = false;
    const updatedContent = content.replace(regex, (_, ...groups) => {
      const [indent, start, currentSnippet, end] = groups;
      didReplace = currentSnippet.trim() !== snippet;
      console.log(`\t${didReplace ? '✓' : '-'} ${path.relative(root, file)}`);
      return `${indent}${start}${indent}${snippet}${end}`;
    });

    if (didReplace) {
      await writeFile(file, updatedContent);
    }
  }
}

updateSnippets().catch((err) => {
  console.error('Error updating snippets:', err);
  process.exit(1);
});
