const WebSocket = require('ws');
const { removeUser } = require('../db');
const mfsCLient = require('./mfs');
const webClient = require('./web');
const { isValidJSON } = require('./funcs');

const wssinit = (server) => {
      const wss = new WebSocket.Server({ server, path: "/ws" });
      wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                  if(!isValidJSON(message)) return
                  const body = JSON.parse(message)
                  if (body.client === "mfs") {
                        mfsCLient({ message, ws, wss })
                        ws.on('close', () => {
                              removeUser(ws.user_id, (err, msg) => {})
                        });
                  }else if(body.client === "web"){
                        webClient({message, ws, wss})
                  }
            });
      });
      return wss
}
module.exports = wssinit