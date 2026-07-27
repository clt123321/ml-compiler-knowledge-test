#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONTENT_DIR = path.resolve(__dirname, '..');

const KIT_REPO_URL = 'https://github.com/clt123321/knowledge-test-kit.git';
const KIT_VERSION = 'v0.1.1';
const KIT_COMMIT = '5d58632122590adb66c6712f0dcf301fe8fb1e36';
const DEFAULT_KIT_DIR = path.join(CONTENT_DIR, '.cache', 'knowledge-test-kit', KIT_VERSION);
const KIT_BANK_SCRIPT = path.join(CONTENT_DIR, 'scripts', 'build-kit-question-bank.mjs');
const MIN_NODE_VERSION = { major: 18, minor: 17, patch: 0 };
const SUPPORTED_COMMANDS = new Set(['dev', 'build', 'preview', 'validate', 'doctor', 'inspect']);

function main() {
  const [command, ...restArgs] = process.argv.slice(2);
  if (!command || !SUPPORTED_COMMANDS.has(command)) {
    printUsage();
    process.exit(command ? 2 : 1);
  }

  checkNodeVersion();
  ensureCommandAvailable('git', ['--version'], 'Git is required to fetch knowledge-test-kit.');
  ensureCommandAvailable('npm', ['--version'], 'npm is required to install and run knowledge-test-kit.');

  const kitInfo = resolveKitDirectory();
  ensureKitDependencies(kitInfo.dir);
  printEnvironmentSummary(kitInfo);
  prepareKitQuestionBank();

  if (command === 'preview') {
    runKitCommand('build', restArgs, kitInfo.dir);
    syncBuildOutputToContent(kitInfo.dir);
    runKitCommand('preview', restArgs, kitInfo.dir);
    return;
  }

  runKitCommand(command, restArgs, kitInfo.dir);

  if (command === 'build') {
    syncBuildOutputToContent(kitInfo.dir);
  }
}

function printUsage() {
  console.error(
    [
      'Usage: node scripts/kit-runner.mjs <command> [extra args]',
      '',
      'Supported commands:',
      '  dev | build | preview | validate | doctor | inspect',
      '',
      'Examples:',
      '  npm run dev',
      '  npm run build',
      '  KNOWLEDGE_TEST_KIT_DIR=../knowledge-test-kit npm run dev',
    ].join('\n'),
  );
}

function checkNodeVersion() {
  const current = parseVersion(process.versions.node);
  const minimum = MIN_NODE_VERSION;
  if (compareVersion(current, minimum) < 0) {
    fail(
      `Node.js ${formatVersion(minimum)} or newer is required by knowledge-test-kit ${KIT_VERSION}. ` +
        `Current version: ${process.versions.node}`,
    );
  }
}

function ensureCommandAvailable(command, args, failureMessage) {
  const result = spawnSync(command, args, { stdio: 'ignore' });
  if (result.error) {
    fail(failureMessage);
  }
}

function resolveKitDirectory() {
  const override = process.env.KNOWLEDGE_TEST_KIT_DIR;
  if (override) {
    const resolved = path.resolve(CONTENT_DIR, override);
    if (!fs.existsSync(resolved)) {
      fail(`KNOWLEDGE_TEST_KIT_DIR does not exist: ${resolved}`);
    }
    verifyKitCommit(resolved, true);
    return { dir: resolved, source: 'KNOWLEDGE_TEST_KIT_DIR' };
  }

  if (!fs.existsSync(DEFAULT_KIT_DIR)) {
    fs.mkdirSync(path.dirname(DEFAULT_KIT_DIR), { recursive: true });
    runCommand(
      'git',
      ['clone', '--depth', '1', '--branch', KIT_VERSION, KIT_REPO_URL, DEFAULT_KIT_DIR],
      { cwd: CONTENT_DIR, label: `Cloning knowledge-test-kit ${KIT_VERSION}` },
    );
  }

  verifyKitCommit(DEFAULT_KIT_DIR, false);
  return { dir: DEFAULT_KIT_DIR, source: 'cache' };
}

function verifyKitCommit(kitDir, isOverride) {
  if (!fs.existsSync(path.join(kitDir, '.git'))) {
    fail(`Knowledge Test Kit directory is not a git checkout: ${kitDir}`);
  }

  const actualCommit = captureCommand(
    'git',
    ['-C', kitDir, 'rev-list', '-n', '1', KIT_VERSION],
    `Failed to inspect ${KIT_VERSION} in ${kitDir}`,
  ).trim();

  if (actualCommit !== KIT_COMMIT) {
    const prefix = isOverride ? 'KNOWLEDGE_TEST_KIT_DIR points to an unexpected Kit revision.' : 'Cached Kit revision mismatch.';
    fail(`${prefix} Expected ${KIT_COMMIT}, got ${actualCommit}.`);
  }
}

function ensureKitDependencies(kitDir) {
  const nodeModulesDir = path.join(kitDir, 'node_modules');
  if (!fs.existsSync(nodeModulesDir)) {
    runCommand(
      'npm',
      ['ci', '--prefix', kitDir],
      { cwd: CONTENT_DIR, label: `Installing knowledge-test-kit dependencies in ${kitDir}` },
    );
  }
}

function printEnvironmentSummary(kitInfo) {
  const gitVersion = captureCommand('git', ['--version'], 'Failed to read git version').trim();
  const npmVersion = captureCommand('npm', ['--version'], 'Failed to read npm version').trim();
  const kitCommit = captureCommand(
    'git',
    ['-C', kitInfo.dir, 'rev-parse', 'HEAD'],
    'Failed to read Kit HEAD',
  ).trim();

  console.log('[kit-runner] Environment');
  console.log(`[kit-runner]   node        ${process.versions.node}`);
  console.log(`[kit-runner]   git         ${gitVersion}`);
  console.log(`[kit-runner]   npm         ${npmVersion}`);
  console.log(`[kit-runner]   kit source  ${kitInfo.source}`);
  console.log(`[kit-runner]   kit path    ${kitInfo.dir}`);
  console.log(`[kit-runner]   kit commit  ${kitCommit}`);
  console.log(`[kit-runner]   content     ${CONTENT_DIR}`);
}

function prepareKitQuestionBank() {
  if (!fs.existsSync(KIT_BANK_SCRIPT)) {
    fail(`Missing Kit compatibility script: ${KIT_BANK_SCRIPT}`);
  }

  runCommand(process.execPath, [KIT_BANK_SCRIPT], {
    cwd: CONTENT_DIR,
    label: 'Preparing Kit-compatible question bank',
  });
}

function runKitCommand(command, restArgs, kitDir) {
  const cliPath = path.join(kitDir, 'packages', 'cli', 'bin', 'knowledge-test.mjs');
  const args = [cliPath, command, ...restArgs, '--content', CONTENT_DIR];
  runCommand(process.execPath, args, { cwd: kitDir, label: `Running knowledge-test ${command}` });
}

function syncBuildOutputToContent(kitDir) {
  const sourceDist = path.join(kitDir, 'apps', 'site', 'dist');
  const targetDist = path.join(CONTENT_DIR, 'dist');

  if (!fs.existsSync(sourceDist)) {
    fail(`Expected build output was not found: ${sourceDist}`);
  }

  fs.rmSync(targetDist, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(targetDist), { recursive: true });
  fs.cpSync(sourceDist, targetDist, { recursive: true });
  console.log(`[kit-runner]   synced dist  ${targetDist}`);
}

function runCommand(command, args, { cwd, label }) {
  if (label) {
    console.log(`[kit-runner] ${label}`);
  }

  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    fail(result.error.message);
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }
}

function captureCommand(command, args, failureMessage) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  });

  if (result.error) {
    fail(failureMessage);
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    const stderr = String(result.stderr || '').trim();
    fail(stderr ? `${failureMessage}\n${stderr}` : failureMessage);
  }

  return String(result.stdout || '');
}

function parseVersion(version) {
  const [major = '0', minor = '0', patch = '0'] = version.split('.');
  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10),
  };
}

function compareVersion(left, right) {
  if (left.major !== right.major) return left.major - right.major;
  if (left.minor !== right.minor) return left.minor - right.minor;
  return left.patch - right.patch;
}

function formatVersion(version) {
  return `${version.major}.${version.minor}.${version.patch}`;
}

function fail(message) {
  console.error(`[kit-runner] ${message}`);
  process.exit(1);
}

main();
