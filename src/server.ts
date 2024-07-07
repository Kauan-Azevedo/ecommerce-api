import { Express } from "express";

function runServer(app: Express, port: number) {
    const server = app.listen(port, () => {
        console.log(`🚀 Server is running at http://localhost:${port} 🚀`);
    });

    return server;
}

export default runServer;