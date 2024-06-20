import * as shell from "shelljs";
import * as fs from "fs";
import * as path from "path";

function createModule(moduleName: string): void {
  const baseDir = path.resolve(__dirname, "..", "..", "src", moduleName);
  const dirs = ["controller", "services", "router"];

  const toPascalCase = (str: string) => {
    return str.replace(
      /(\w)(\w*)/g,
      (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase(),
    );
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

    let filePath: string;
    let fileContent: string;
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
        fileContent = `import { prisma } from "@/db/db.config";

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
} else {
  console.log("Please provide a module name");
}
