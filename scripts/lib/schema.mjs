#!/usr/bin/env node
// scripts/lib/schema.mjs — 最小的 Schema 校验实现（不依赖 ajv）

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ROOT } from "./loader.mjs";

const SCHEMAS = {};

async function loadSchema(name) {
  if (SCHEMAS[name]) return SCHEMAS[name];
  const path = join(ROOT, "schemas", `${name}.schema.json`);
  SCHEMAS[name] = JSON.parse(await readFile(path, "utf-8"));
  return SCHEMAS[name];
}

// 轻量校验器：覆盖 required / type / enum / minimum / maximum / minLength / minItems / maxItems / uniqueItems / pattern / additionalProperties
function validateNode(node, schema, path, errs) {
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual =
      node === null ? "null" : Array.isArray(node) ? "array" : typeof node;
    const ok = types.some((t) => {
      if (t === "integer") return Number.isInteger(node);
      if (t === "number") return typeof node === "number";
      return t === actual;
    });
    if (!ok) {
      errs.push(`${path}: expected type ${JSON.stringify(types)}, got ${actual}`);
      return;
    }
  }
  if (schema.enum && !schema.enum.includes(node)) {
    errs.push(`${path}: value ${JSON.stringify(node)} not in enum ${JSON.stringify(schema.enum)}`);
  }
  if (typeof node === "number") {
    if (schema.minimum != null && node < schema.minimum) errs.push(`${path}: < minimum`);
    if (schema.maximum != null && node > schema.maximum) errs.push(`${path}: > maximum`);
  }
  if (typeof node === "string") {
    if (schema.minLength != null && node.length < schema.minLength)
      errs.push(`${path}: length < minLength ${schema.minLength}`);
    if (schema.pattern) {
      const re = new RegExp(schema.pattern);
      if (!re.test(node)) errs.push(`${path}: does not match pattern ${schema.pattern}`);
    }
  }
  if (Array.isArray(node)) {
    if (schema.minItems != null && node.length < schema.minItems)
      errs.push(`${path}: array length < minItems ${schema.minItems}`);
    if (schema.maxItems != null && node.length > schema.maxItems)
      errs.push(`${path}: array length > maxItems ${schema.maxItems}`);
    if (schema.uniqueItems) {
      const seen = new Set();
      for (const it of node) {
        const k = JSON.stringify(it);
        if (seen.has(k)) errs.push(`${path}: duplicate item ${k}`);
        seen.add(k);
      }
    }
    if (schema.items) {
      node.forEach((it, i) => validateNode(it, schema.items, `${path}[${i}]`, errs));
    }
  }
  if (schema.oneOf && Array.isArray(schema.oneOf)) {
    const local = [];
    let matched = 0;
    for (const sub of schema.oneOf) {
      const e = [];
      validateNode(node, sub, path, e);
      if (e.length === 0) matched += 1;
      else local.push(e);
    }
    if (matched === 0) errs.push(`${path}: oneOf mismatch: ${JSON.stringify(local)}`);
  }
  if (node && typeof node === "object" && !Array.isArray(node)) {
    if (schema.required) {
      for (const key of schema.required) {
        if (!(key in node)) errs.push(`${path}.${key}: missing required`);
      }
    }
    if (schema.properties) {
      for (const [key, sub] of Object.entries(schema.properties)) {
        if (key in node) validateNode(node[key], sub, `${path}.${key}`, errs);
      }
    }
    if (schema.additionalProperties === false && schema.properties) {
      const allowed = new Set(Object.keys(schema.properties));
      for (const key of Object.keys(node)) {
        if (key.startsWith("__")) continue; // internal
        if (!allowed.has(key)) errs.push(`${path}.${key}: additional property not allowed`);
      }
    }
    if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
      const definedProps = schema.properties ? new Set(Object.keys(schema.properties)) : new Set();
      for (const [key, value] of Object.entries(node)) {
        if (definedProps.has(key)) continue;
        if (key.startsWith("__")) continue;
        validateNode(value, schema.additionalProperties, `${path}.${key}`, errs);
      }
    }
  }
}

export async function validateAgainst(schemaName, doc) {
  const schema = await loadSchema(schemaName);
  const errs = [];
  validateNode(doc, schema, "$", errs);
  return errs;
}
