import test from "node:test";
import assert from "node:assert/strict";
import { ApiError } from "../utils/errors.js";
import { assertTransition, calculateSettlement, lotTransitions, shipmentTransitions } from "../services/workflows.js";

test("lot workflow allows only valid transitions", () => {
  assert.doesNotThrow(() => assertTransition(lotTransitions, "CREATED", "RECEIVED"));
  assert.throws(() => assertTransition(lotTransitions, "CREATED", "DELIVERED"), ApiError);
  assert.throws(() => assertTransition(lotTransitions, "REJECTED", "ALLOCATED"), ApiError);
});

test("shipment workflow prevents delivered shipment from dispatching again", () => {
  assert.doesNotThrow(() => assertTransition(shipmentTransitions, "IN_TRANSIT", "DELIVERED"));
  assert.throws(() => assertTransition(shipmentTransitions, "DELIVERED", "DISPATCHED"), ApiError);
});

test("settlement calculation uses accepted quantity and adjustments", () => {
  const result = calculateSettlement({
    acceptedQuantity: 1000,
    basePrice: 20,
    qualityAdjustment: 10,
    deductions: 500,
    transportCharges: 300,
    otherAdjustments: 100
  });
  assert.equal(result.grossAmount, 22000);
  assert.equal(result.netPayableAmount, 21300);
});
