#!/usr/bin/env node

import fs from "fs";
import * as t from "@babel/types";
import { parse as recastParse, print as recastPrint, visit } from "recast";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const babelParser = require("recast/parsers/babel");

const [,, filePath, prefix, relativePath, componentName, configJson, rewriteFlag = "false"] = process.argv;

if (!filePath || !prefix || !relativePath || !componentName || !configJson) {
  console.error("annotate_ppids_transform: missing required arguments");
  process.exit(2);
}

const CONFIG = JSON.parse(configJson);
const REWRITE = rewriteFlag === "true";
const SLOT_MAP = CONFIG.slotMap;
const TEXTUAL_SLOTS = new Set(CONFIG.textualSlots);
const ALWAYS_ANNOTATE = new Set(CONFIG.alwaysAnnotate);
const CTA_PRIMARY_PATTERNS = CONFIG.ctaPrimaryPatterns.map((pattern) => new RegExp(pattern, "i"));
const CTA_SECONDARY_PATTERNS = CONFIG.ctaSecondaryPatterns.map((pattern) => new RegExp(pattern, "i"));

const code = fs.readFileSync(filePath, "utf8");
const ast = recastParse(code, { parser: babelParser });

const slotCounters = new Map();
const loopIndexContext = new WeakMap();

const collectLoopContext = (rootAst) => {
  visit(rootAst, {
    visitCallExpression(path) {
      const callee = path.node.callee;
      if (!t.isMemberExpression(callee)) {
        return this.traverse(path);
      }

      if (!t.isIdentifier(callee.property) || callee.property.name !== "map") {
        return this.traverse(path);
      }

      const [callback] = path.node.arguments;
      if (!callback || (!t.isArrowFunctionExpression(callback) && !t.isFunctionExpression(callback))) {
        return this.traverse(path);
      }

      const params = callback.params;
      const indexParam = params.length > 1 && t.isIdentifier(params[1]) ? params[1] : null;
      const indexName = indexParam ? indexParam.name : null;

      if (!indexName) {
        return this.traverse(path);
      }

      visit(callback.body, {
        visitJSXElement(innerPath) {
          loopIndexContext.set(innerPath.node, indexName);
          this.traverse(innerPath);
          return false;
        },
        visitJSXFragment(innerPath) {
          loopIndexContext.set(innerPath.node, indexName);
          this.traverse(innerPath);
          return false;
        },
      });

      return this.traverse(path);
    },
  });
};

const toIdentifier = (nameNode) => {
  if (t.isJSXIdentifier(nameNode)) {
    return nameNode.name;
  }
  if (t.isJSXMemberExpression(nameNode)) {
    const left = toIdentifier(nameNode.object);
    const right = toIdentifier(nameNode.property);
    return `${left}.${right}`;
  }
  return null;
};

const hasAttribute = (attributes, attrName) => attributes.some(
  (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === attrName,
);

const findAttribute = (attributes, attrName) =>
  attributes.find((attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === attrName);

const removeAttribute = (attributes, attrName) => {
  const next = [];
  for (const attr of attributes) {
    if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === attrName) {
      continue;
    }
    next.push(attr);
  }
  return next;
};

const extractLiteralAttribute = (attributes, attrName) => {
  for (const attr of attributes) {
    if (!t.isJSXAttribute(attr) || !t.isJSXIdentifier(attr.name) || attr.name.name !== attrName) {
      continue;
    }
    if (!attr.value) {
      return "";
    }
    if (t.isStringLiteral(attr.value)) {
      return attr.value.value;
    }
    if (t.isJSXExpressionContainer(attr.value) && t.isStringLiteral(attr.value.expression)) {
      return attr.value.expression.value;
    }
  }
  return null;
};

const sanitizeSlot = (raw) => raw.replace(/[^A-Za-z0-9_.-]/g, "");

const sanitizeDynamicLiteral = (value) => {
  const lowered = value.toLowerCase();
  const cleaned = lowered.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "item";
};

const cloneExpression = (expression) => (t.cloneNode ? t.cloneNode(expression, true) : expression);

const findNearestKeyExpression = (path) => {
  let current = path.parentPath;
  while (current) {
    const node = current.node;
    if (t.isJSXElement(node)) {
      const { attributes } = node.openingElement;
      for (const attr of attributes) {
        if (!t.isJSXAttribute(attr) || !t.isJSXIdentifier(attr.name) || attr.name.name !== "key") {
          continue;
        }

        if (!attr.value) {
          continue;
        }

        if (t.isStringLiteral(attr.value)) {
          return t.stringLiteral(attr.value.value);
        }

        if (t.isJSXExpressionContainer(attr.value)) {
          return cloneExpression(attr.value.expression);
        }
      }
    }

    current = current.parentPath;
  }

  return null;
};

const nextIndex = (slotKey) => {
  const existing = slotCounters.get(slotKey) ?? 0;
  const next = existing + 1;
  slotCounters.set(slotKey, next);
  return next;
};

const hasTextualChild = (elementPath) => {
  const parent = elementPath.parentPath?.node;
  if (!parent || !t.isJSXElement(parent)) {
    return true;
  }
  return parent.children.some((child) => {
    if (t.isJSXText(child)) {
      return child.value.trim().length > 0;
    }
    if (t.isJSXExpressionContainer(child)) {
      const { expression } = child;
      if (t.isStringLiteral(expression) || t.isNumericLiteral(expression)) {
        return `${expression.value}`.trim().length > 0;
      }
      if (t.isTemplateLiteral(expression)) {
        const text = expression.quasis.map((q) => q.value.cooked ?? "").join("");
        return text.trim().length > 0;
      }
    }
    return false;
  });
};

const buildSlot = (tagName, attributes, elementPath) => {
  const manualSlot = extractLiteralAttribute(attributes, "data-ppid-slot");
  if (manualSlot) {
    return sanitizeSlot(manualSlot);
  }

  let slot = SLOT_MAP[tagName] ?? SLOT_MAP[tagName.toLowerCase()] ?? tagName.toLowerCase();

  if (slot === "cta") {
    const classValue = extractLiteralAttribute(attributes, "className") ?? "";
    for (const pattern of CTA_PRIMARY_PATTERNS) {
      if (pattern.test(classValue)) {
        slot = "ctaPrimary";
        break;
      }
    }
    if (slot === "cta") {
      for (const pattern of CTA_SECONDARY_PATTERNS) {
        if (pattern.test(classValue)) {
          slot = "ctaSecondary";
          break;
        }
      }
    }
  }

  if (slot === "inline" && !hasTextualChild(elementPath)) {
    slot = "wrapper";
  }

  return sanitizeSlot(slot);
};

const shouldAnnotate = (slot) => ALWAYS_ANNOTATE.has(slot) || !TEXTUAL_SLOTS.has(slot) || slot === "wrapper";

collectLoopContext(ast);

visit(ast, {
  visitJSXOpeningElement(path) {
    const nameNode = path.node.name;
    const tagName = toIdentifier(nameNode);
    if (!tagName) {
      return false;
    }

    const attributes = path.node.attributes;

    if (hasAttribute(attributes, "data-ppid-ignore")) {
      path.node.attributes = removeAttribute(attributes, "data-ppid-ignore");
      return false;
    }

    const inMap = SLOT_MAP[tagName] || SLOT_MAP[tagName.toLowerCase()];
    if (!inMap) {
      return false;
    }

    const existingAttribute = findAttribute(attributes, "data-ppid");
    if (existingAttribute) {
      if (!REWRITE) {
        return false;
      }

      if (!existingAttribute.value || !t.isStringLiteral(existingAttribute.value)) {
        return false;
      }
    }

    const slot = buildSlot(tagName, attributes, path);

    if (!shouldAnnotate(slot) && !hasTextualChild(path)) {
      return false;
    }

    const slotKey = `${componentName}.${slot}`;
    const index = nextIndex(slotKey);

    const loopIndexName = loopIndexContext.get(path.parent.node) || loopIndexContext.get(path.node);
    const keyExpression = findNearestKeyExpression(path);
    const staticBase = `${prefix}/${relativePath}#${componentName}.${slot}.${index}`;

    const dynamicSegments = [];
    if (loopIndexName) {
      const incrementExpr = t.binaryExpression("+", t.identifier(loopIndexName), t.numericLiteral(1));
      dynamicSegments.push({ type: "expr", expr: incrementExpr });
    }

    if (keyExpression) {
      if (t.isStringLiteral(keyExpression)) {
        const segment = sanitizeDynamicLiteral(keyExpression.value);
        dynamicSegments.push({ type: "string", value: segment });
      } else {
        dynamicSegments.push({ type: "expr", expr: cloneExpression(keyExpression) });
      }
    }

    let attributeValue;
    if (!dynamicSegments.length) {
      attributeValue = t.stringLiteral(staticBase);
    } else if (dynamicSegments.every((segment) => segment.type === "string")) {
      const suffix = dynamicSegments.map((segment) => segment.value).join(".");
      attributeValue = t.stringLiteral(`${staticBase}.${suffix}`);
    } else {
      let currentLiteral = staticBase;
      const quasis = [];
      const expressions = [];

      dynamicSegments.forEach((segment) => {
        if (segment.type === "string") {
          currentLiteral += `.${segment.value}`;
          return;
        }

        quasis.push(t.templateElement({ raw: `${currentLiteral}.`, cooked: `${currentLiteral}.` }));
        expressions.push(segment.expr);
        currentLiteral = "";
      });

      quasis.push(t.templateElement({ raw: currentLiteral, cooked: currentLiteral }, true));

      attributeValue = t.jsxExpressionContainer(t.templateLiteral(quasis, expressions));
    }

    path.node.attributes = removeAttribute(path.node.attributes, "data-ppid-slot");
    if (existingAttribute && REWRITE) {
      path.node.attributes = removeAttribute(path.node.attributes, "data-ppid");
    }
    path.node.attributes.push(t.jsxAttribute(t.jsxIdentifier("data-ppid"), attributeValue));

    this.traverse(path);
    return false;
  },
});

const output = recastPrint(ast, { lineTerminator: "\n" }).code;

process.stdout.write(output);
