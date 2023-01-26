require("dotenv").config();
const http = require("http");
const url = require("url");
const disconnect = require("./orm/init").disconnect;
import { app } from "./app";

let server = http.createServer(app);

module.exports.server = server;

// Websockets required to make APIs work and avoid circular dependency
let websocket = require("./websockets");
let anonWebSocket = require("./anonwebsockets");

// We use one Winston instance for the entire app

const logger = require("./logger").child({ module: __filename });

server.on("upgrade", function upgrade(request, socket, head) {
  logger.debug("upgrade");
  const pathname = url.parse(request.url).pathname;

  if (pathname === "/api/admin/ws") {
    websocket.getWS().handleUpgrade(request, socket, head, function done(ws) {
      ws.type = "admin";
      websocket.getWS().emit("connection", ws, request);
    });
  } else if (pathname === "/api/anon/ws") {
    anonWebSocket
      .getWS()
      .handleUpgrade(request, socket, head, function done(ws) {
        ws.type = "anon";
        anonWebSocket.getWS().emit("connection", ws, request);
      });
  } else {
    socket.destroy();
  }
});

anonWebSocket.start();
websocket.start();

server.listen(process.env.CONTROLLERPORT || 80, () =>
  logger.info(
    `Server listening at http://localhost:${process.env.CONTROLLERPORT || 80}`,
    `\n Agent Address: ${process.env.AGENTADDRESS || "localhost:8150"}`
  )
);

// Clean termination
// Finish all incoming connections, then close upstream

process.on("SIGTERM", () => {
  logger.info("Shutting down on SIGTERM");
  logger.info("Shutting down incoming connections...");
  Promise.all([server.stop(), websocket.close(), anonWebSocket.close()]).then(
    () => {
      logger.info("Shutting down outgoing connections...");
      disconnect().then(() => {
        logger.info("All shut down.");
        logger.end();
      });
    }
  );
});
