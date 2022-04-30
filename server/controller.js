import { Constants } from "./constants.js";

function Controller(playerId, controllersocket, playerSocket) {
  this.playerId = playerId;
  this.controllerSocket = controllersocket;
  this.playerSocket = playerSocket;
}

export default Controller
