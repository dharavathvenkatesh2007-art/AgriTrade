import { ApiError } from "../utils/errors.js";

export const lotTransitions = {
  CREATED: ["RECEIVED"],
  RECEIVED: ["INSPECTION_PENDING"],
  INSPECTION_PENDING: ["INSPECTED", "REJECTED"],
  INSPECTED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["STORED"],
  REJECTED: [],
  STORED: ["ALLOCATED"],
  ALLOCATED: ["DISPATCHED"],
  DISPATCHED: ["DELIVERED"],
  DELIVERED: []
};

export const shipmentTransitions = {
  PLANNED: ["VEHICLE_ASSIGNED"],
  VEHICLE_ASSIGNED: ["READY_FOR_DISPATCH", "DISPATCHED"],
  READY_FOR_DISPATCH: ["DISPATCHED"],
  DISPATCHED: ["IN_TRANSIT"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY", "DELIVERED", "FAILED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED"],
  DELIVERED: [],
  FAILED: []
};

export function assertTransition(map, current, next) {
  if (!map[current]?.includes(next)) {
    throw new ApiError(409, `Cannot move from ${current} to ${next}`, "INVALID_STATUS_TRANSITION");
  }
}

export function calculateSettlement({ acceptedQuantity, basePrice, qualityAdjustment = 0, deductions = 0, transportCharges = 0, otherAdjustments = 0 }) {
  const grossAmount = acceptedQuantity * basePrice * (1 + qualityAdjustment / 100);
  const netPayableAmount = grossAmount - deductions - transportCharges + otherAdjustments;
  if (netPayableAmount < 0) throw new ApiError(422, "Settlement cannot be negative", "NEGATIVE_SETTLEMENT");
  return { grossAmount, netPayableAmount };
}
