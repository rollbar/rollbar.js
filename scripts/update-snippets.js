#!/usr/bin/env node

/**
 * Updates the Rollbar snippet in js and html files under a specified base
 * directory from the project root.
 *
 * Usage:
 *   update-snippets <baseDir>
 *
 * If <baseDir> is omitted, it defaults to '.' (current directory).
 *
 * Replaces content between "// Rollbar Snippet" and "// End Rollbar Snippet" markers.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import glob from 'glob';

import { findUp } from './util.js';

const verbose = ['--verbose', '-v'].some((f) => process.argv.includes(f));
const baseDir = process.argv.at(verbose ? 3 : 2);

function replaceSnippet({ content, snippet, regex, file, root }) {
  let didMatch = false;
  let wasReplaced = false;

  const updatedContent = content.replace(regex, (...args) => {
    const { indent, start, currentSnippet, end } = args.at(-1); // groups
    didMatch = true;
    wasReplaced = currentSnippet.trim() !== snippet;
    console.log(`  ${wasReplaced ? '✓' : '-'} ${path.relative(root, file)}`);
    return `${indent}${start}${indent}${snippet}${end}`;
  });

  if (verbose && !didMatch) {
    console.log(`  ✗ ${path.relative(root, file)}`);
  }

  return { updatedContent, wasReplaced };
}

async function updateSnippets({ dir }) {
  if (!dir) {
    throw new Error('baseDir is required.');
  }

  const cwd = path.dirname(fileURLToPath(import.meta.url));
  const root = await findUp({ fileName: 'package.json', dir: cwd });

  console.log(`Updating Rollbar snippets in ${path.relative(root, cwd)}...`);

  if (verbose) {
    console.log(`Found project root at ${root}`);
  }

  const snippetPath = path.join(root, 'dist/rollbar.snippet.js');
  const snippet = await readFile(snippetPath, 'utf8');

  const regex = new RegExp(
    '^' +
      '(?<indent>[ \t]*)' +
      '(?<start>// Rollbar Snippet\n)' +
      '(?<currentSnippet>.*?)' +
      '(?<end>\n[ \t]*// End Rollbar Snippet)' +
      '$',
    'ms',
  );

  const files = glob.sync(`${dir}/**/*.{html,js}`, {
    cwd: root,
    absolute: true,
    ignore: ['**/.git/**', '**/node_modules/**'],
  });

  if (files.length === 0) {
    throw new Error(`No files found in ${path.relative(root, dir)} to update.`);
  }

  let snippetsUpdated = 0;

  for (const file of files) {
    const content = await readFile(file, 'utf8');

    const { updatedContent, wasReplaced } = replaceSnippet({
      content,
      snippet,
      regex,
      file,
      root,
    });

    if (wasReplaced) {
      await writeFile(file, updatedContent);
      snippetsUpdated++;
    }
  }

  console.log(`${snippetsUpdated} snippets updated.`);
}

updateSnippets({ dir: baseDir }).catch((err) => {
  console.error('Error updating snippets:', err);
  console.error('\nUsage: update-snippets [--verbose|-v] <baseDir>');
  console.error('Example:');
  console.error('  update-snippets examples');
  process.exit(1);
});
