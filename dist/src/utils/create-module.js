"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const shell = __importStar(require("shelljs"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function createModule(moduleName) {
    const baseDir = path.resolve(__dirname, "..", "..", "src", moduleName);
    const dirs = ["controller", "services", "router"];
    const toPascalCase = (str) => {
        return str.replace(/(\w)(\w*)/g, (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase());
    };
    const className = toPascalCase(moduleName);
    if (fs.existsSync(baseDir)) {
        console.log(`Module ${moduleName} already exists. Aborting.`);
        return;
    }
    shell.mkdir("-p", baseDir);
    // Caminho relativo do serviço para importação no controlador
    const servicePath = `../services/${moduleName}.service`;
    dirs.forEach((dir) => {
        const dirPath = path.join(baseDir, dir);
        if (fs.existsSync(dirPath)) {
            console.log(`Directory ${dirPath} already exists. Skipping.`);
            return;
        }
        shell.mkdir("-p", dirPath);
        let filePath;
        let fileContent;
        switch (dir) {
            case "controller":
                filePath = path.join(dirPath, `${moduleName}.controller.ts`);
                fileContent = `import { ${className}Service } from "${servicePath}";

class ${className}Controller {

  constructor(private readonly ${moduleName}Service: ${className}Service) { }

  // Your controller methods here
}

export { ${className}Controller };`;
                fs.writeFileSync(filePath, fileContent);
                break;
            case "services":
                filePath = path.join(dirPath, `${moduleName}.service.ts`);
                fileContent = `import { prisma } from "@/db/prisma.service";

class ${className}Service {
  constructor() {
    // Constructor logic here, if needed
  }

  // Your service methods here
}

export { ${className}Service };`;
                fs.writeFileSync(filePath, fileContent);
                break;
            case "router":
                filePath = path.join(dirPath, `${moduleName}.router.ts`);
                fileContent = `import express from "express";
import { ${className}Controller } from "../controller/${moduleName}.controller";
import { ${className}Service } from "../services/${moduleName}.service";

const router = express.Router();
const ${moduleName}Service = new ${className}Service(); // Instanciando o serviço
const ${moduleName}Controller = new ${className}Controller(${moduleName}Service);

// Your routes here

export default router;`;
                fs.writeFileSync(filePath, fileContent);
                break;
            default:
                break;
        }
    });
    console.log(`${moduleName} module created successfully!`);
}
const moduleName = process.argv[2];
if (moduleName) {
    createModule(moduleName);
}
else {
    console.log("Please provide a module name");
}
