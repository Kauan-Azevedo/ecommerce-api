import { Express } from "express";

function runServer(app: Express, port: number, dev: boolean) {
    const server = app.listen(port, () => {
        if (dev) {
            console.log(`🚀 Server is running at http://localhost:${port} 🚀`);
        }
    });

    return server;
}

export default runServer;