import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveLanguage } from "../src/lib/language.ts";

test("a supported cookie takes precedence; invalid cookies fall back to the header", () => {
  assert.equal(resolveLanguage("en", "fr-BE"), "en");
  assert.equal(resolveLanguage("fr", "en"), "fr");
  assert.equal(resolveLanguage("invalid", "fr-BE"), "fr");
});

test("header preferences handle regions, weights, exclusions, and stable ties", () => {
  assert.equal(resolveLanguage(undefined, "en;q=0.4,FR-be;q=0.9"), "fr");
  assert.equal(resolveLanguage(undefined, "fr;q=0,en;q=0.5"), "en");
  assert.equal(resolveLanguage(undefined, "fr;q=0.8,en;q=0.8"), "fr");
  assert.equal(resolveLanguage(undefined, "fr;q=oops,en"), "en");
  assert.equal(resolveLanguage(undefined, "fr;q=1.5,en"), "en");
});

test("an unsupported first preference or no usable preference defaults to English", () => {
  for (const header of [null, "", "*", "de,fr;q=0.9", "fr;q=0", "not a language"]) {
    assert.equal(resolveLanguage(undefined, header), "en");
  }
});
