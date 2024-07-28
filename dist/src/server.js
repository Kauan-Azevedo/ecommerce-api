"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function runServer(app, port, dev) {
    const server = app.listen(port, () => {
        if (dev) {
            console.log(`🚀 Server is running at http://localhost:${port} 🚀`);
        }
    });
    return server;
}
exports.default = runServer;
