import { Express } from "express";
import morgan from "morgan";

function runServer(app: Express, port: number, dev: boolean) {
    if (dev) {
        app.use(morgan("dev"));
    }

    const server = app.listen(port, () => {
        if (dev) {
            console.log(`🚀 Server is running at http://localhost:${port} 🚀`);
        }
    });

    return server;
}

export default runServer;