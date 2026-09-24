import { models } from "../models/index.js";
import { scopedQuery } from "../middleware/auth.js";
import { ApiError, asyncHandler, sendSuccess } from "../utils/errors.js";
import { audit } from "../services/audit.js";

const populateMap = {
  lots: ["farmer", "farm", "produceCategory", "collectionCenter", "warehouse", "storageLocation", "organization", "region"],
  inspections: ["lot", "inspector", "organization", "region"],
  farmers: ["user", "organization", "region"],
  farms: ["farmer", "organization", "region"],
  "grading-criteria": ["produceCategory", "organization", "region"],
  warehouses: ["manager", "organization", "region"],
  inventory: ["lot", "produceCategory", "warehouse", "storageLocation", "organization", "region"],
  "purchase-orders": ["buyer", "lineItems.produceCategory", "organization", "region"],
  allocations: ["purchaseOrder", "lot", "farmer", "organization", "region"],
  vehicles: ["driver", "organization", "region"],
  shipments: ["purchaseOrder", "vehicle", "driver", "allocations", "organization", "region"],
  settlements: ["farmer", "lot", "purchaseOrder", "organization", "region"],
  disputes: ["raisedBy", "relatedLot", "relatedOrder", "relatedShipment", "assignedAdmin", "organization", "region"]
};

export function resourceController(resourceName) {
  const Model = models[resourceName];
  if (!Model) throw new Error(`Unknown resource ${resourceName}`);

  const populates = populateMap[resourceName] || [];

  return {
    list: asyncHandler(async (req, res) => {
      const page = Math.max(Number(req.query.page || 1), 1);
      const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
      const skip = (page - 1) * limit;
      const query = { ...scopedQuery(req) };
      if (req.query.status) query.status = req.query.status;
      if (req.query.region) query.region = req.query.region;
      if (req.query.organization) query.organization = req.query.organization;
      if (req.query.farmer) query.farmer = req.query.farmer;
      if (req.query.buyer) query.buyer = req.query.buyer;
      if (req.query.user) query.user = req.query.user;
      if (req.query.search) {
        query.$or = [
          { name: new RegExp(req.query.search, "i") },
          { lotNumber: new RegExp(req.query.search, "i") },
          { poNumber: new RegExp(req.query.search, "i") },
          { shipmentNumber: new RegExp(req.query.search, "i") },
          { settlementNumber: new RegExp(req.query.search, "i") },
          { disputeNumber: new RegExp(req.query.search, "i") },
          { farmerCode: new RegExp(req.query.search, "i") }
        ];
      }
      const sort = req.query.sort || "-createdAt";
      
      let queryExec = Model.find(query).sort(sort).skip(skip).limit(limit);
      for (const p of populates) {
        queryExec = queryExec.populate(p);
      }

      const [data, total] = await Promise.all([
        queryExec.lean(),
        Model.countDocuments(query)
      ]);
      sendSuccess(res, data, `${resourceName} list`, 200, { page, limit, total, pages: Math.ceil(total / limit) });
    }),
    get: asyncHandler(async (req, res) => {
      let queryExec = Model.findOne({ _id: req.params.id, ...scopedQuery(req) });
      for (const p of populates) {
        queryExec = queryExec.populate(p);
      }
      const item = await queryExec.lean();
      if (!item) throw new ApiError(404, "Record not found", "NOT_FOUND");
      sendSuccess(res, item, `${resourceName} detail`);
    }),
    create: asyncHandler(async (req, res) => {
      const payload = { ...req.body };
      if (req.user.organization && payload.organization === undefined) payload.organization = req.user.organization;
      if (req.user.region && payload.region === undefined) payload.region = req.user.region;
      const item = await Model.create(payload);
      await audit(req, "CREATE", resourceName, Model.modelName, item._id, null, item.toObject());
      sendSuccess(res, item, "Record created", 201);
    }),
    update: asyncHandler(async (req, res) => {
      const existing = await Model.findOne({ _id: req.params.id, ...scopedQuery(req) });
      if (!existing) throw new ApiError(404, "Record not found", "NOT_FOUND");
      const previous = existing.toObject();
      Object.assign(existing, req.body);
      await existing.save();
      await audit(req, "UPDATE", resourceName, Model.modelName, existing._id, previous, existing.toObject());
      sendSuccess(res, existing, "Record updated");
    }),
    remove: asyncHandler(async (req, res) => {
      const existing = await Model.findOne({ _id: req.params.id, ...scopedQuery(req) });
      if (!existing) throw new ApiError(404, "Record not found", "NOT_FOUND");
      if ("isActive" in existing) {
        existing.isActive = false;
        await existing.save();
        await audit(req, "ARCHIVE", resourceName, Model.modelName, existing._id, null, { isActive: false });
        return sendSuccess(res, existing, "Record archived");
      }
      throw new ApiError(409, "Historical records cannot be deleted; archive related master data instead", "DELETE_PREVENTED");
    })
  };
}
