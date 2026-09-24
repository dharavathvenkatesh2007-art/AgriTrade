import { AuditLog } from "../models/index.js";

export async function audit(req, action, module, entity, entityId, previousValue, newValue) {
  if (!req.user) return;
  await AuditLog.create({
    user: req.user._id,
    role: req.user.role,
    action,
    module,
    entity,
    entityId,
    previousValue,
    newValue,
    ip: req.ip,
    device: req.headers["user-agent"],
    organization: req.user.organization,
    region: req.user.region
  });
}
