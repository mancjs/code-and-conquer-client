'use strict';

const mine = (client, cell) => {
  const state = client.getState();  
  state.socket.write(`mine ${state.key} ${cell}\n`);
};

const spy = (client, targetTeamName, redirectToCell) => {
  const state = client.getState();  
  state.socket.write(`spy ${state.key} ${targetTeamName} ${redirectToCell}\n`);
};

const cloak = (client, cloakCell1, cloakCell2, cloakCell3) => {
  const state = client.getState();  
  state.socket.write(`cloak ${state.key} ${cloakCell1} ${cloakCell2} ${cloakCell3}\n`);
};

module.exports = {
  mine,
  spy,
  cloak
};