"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = seedPermissions;
const setup_1 = require("./setup/setup");
let permissionsFromEnv = (_a = process.env.SEED_PERMISSIONS) === null || _a === void 0 ? void 0 : _a.split(",").map((permission) => permission.trim());
function seedPermissions() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!permissionsFromEnv) {
            permissionsFromEnv = ["Admin", "Seller", "User"];
        }
        // Ensure that Admin permission is always created first
        if (permissionsFromEnv[0] != "Admin") {
            permissionsFromEnv.unshift("Admin");
        }
        for (const permission of permissionsFromEnv) {
            yield (0, setup_1.createPermission)(permission);
        }
    });
}
