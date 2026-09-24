import test from "node:test";
import assert from "node:assert/strict";
import { humanStatus, statusClass } from "./status.js";

test("humanStatus formats machine states for users", () => {
  assert.equal(humanStatus("INSPECTION_PENDING"), "Inspection Pending");
  assert.equal(humanStatus("IN_TRANSIT"), "In Transit");
});

test("statusClass provides a fallback", () => {
  assert.match(statusClass("SOMETHING_NEW"), /bg-slate/);
  assert.match(statusClass("ACCEPTED"), /emerald/);
});
