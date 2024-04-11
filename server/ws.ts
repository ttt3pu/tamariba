import express from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { createServer } from 'http';

const PORT = Number(process.env.WS_PORT);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const CLIENTS: {
  [id: string]: WebSocket;
} = {};

let currentId = 0;

wss.on('connection', function (ws) {
  currentId++;

  const id = 'client-' + currentId;

  CLIENTS[id] = ws;

  ws.on('message', function (message) {
    console.log('received: %s', message);

    Object.keys(CLIENTS).forEach((clientId) => {
      CLIENTS[clientId].send(String(message));
    });
  });

  ws.on('close', function () {
    console.log('ユーザー：' + id + ' がブラウザを閉じました');
    delete CLIENTS[id];
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
