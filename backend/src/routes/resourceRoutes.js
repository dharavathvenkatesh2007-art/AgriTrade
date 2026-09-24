import { Router } from "express";
import multer from "multer";
import { resourceController } from "../controllers/resourceController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { roles } from "../utils/constants.js";
import {
  acceptLot,
  allocatePo,
  approveSettlement,
  assignVehicle,
  cancelPo,
  deliverShipment,
  dispatchShipment,
  inTransitShipment,
  inspectLot,
  paySettlement,
  receiveLot,
  rejectLot,
  sendToInspection,
  storeLot
} from "../controllers/workflowController.js";

const upload = multer({ dest: "uploads/" });
const router = Router();

const resources = [
  "users",
  "organizations",
  "regions",
  "farmers",
  "farms",
  "produce-categories",
  "lots",
  "inspections",
  "grading-criteria",
  "warehouses",
  "inventory",
  "inventory-movements",
  "purchase-orders",
  "allocations",
  "vehicles",
  "drivers",
  "shipments",
  "settlements",
  "disputes",
  "notifications",
  "audit-logs"
];

for (const resource of resources) {
  const controller = resourceController(resource);
  router.get(`/${resource}`, authenticate, controller.list);
  router.get(`/${resource}/:id`, authenticate, controller.get);
  router.post(`/${resource}`, authenticate, upload.array("files"), controller.create);
  router.patch(`/${resource}/:id`, authenticate, controller.update);
  router.delete(`/${resource}/:id`, authenticate, authorize(roles.ADMIN), controller.remove);
}

router.post("/lots/:id/receive", authenticate, authorize(roles.COLLECTION_MANAGER, roles.ADMIN), receiveLot);
router.post("/lots/:id/inspection-pending", authenticate, authorize(roles.COLLECTION_MANAGER, roles.ADMIN), sendToInspection);
router.post("/lots/:id/inspect", authenticate, authorize(roles.INSPECTOR, roles.ADMIN), upload.array("evidence"), inspectLot);
router.post("/lots/:id/accept", authenticate, authorize(roles.INSPECTOR, roles.ADMIN), acceptLot);
router.post("/lots/:id/reject", authenticate, authorize(roles.INSPECTOR, roles.ADMIN), rejectLot);
router.post("/lots/:id/store", authenticate, authorize(roles.COLLECTION_MANAGER, roles.ADMIN), storeLot);
router.post("/purchase-orders/:id/allocate", authenticate, authorize(roles.BUYER, roles.ADMIN), allocatePo);
router.post("/purchase-orders/:id/cancel", authenticate, authorize(roles.BUYER, roles.ADMIN), cancelPo);
router.post("/shipments/:id/assign-vehicle", authenticate, authorize(roles.LOGISTICS, roles.ADMIN), assignVehicle);
router.post("/shipments/:id/dispatch", authenticate, authorize(roles.LOGISTICS, roles.ADMIN), dispatchShipment);
router.post("/shipments/:id/in-transit", authenticate, authorize(roles.LOGISTICS, roles.ADMIN), inTransitShipment);
router.post("/shipments/:id/deliver", authenticate, authorize(roles.LOGISTICS, roles.ADMIN), deliverShipment);
router.post("/settlements/:id/approve", authenticate, authorize(roles.ADMIN), approveSettlement);
router.post("/settlements/:id/pay", authenticate, authorize(roles.ADMIN), paySettlement);

export default router;
