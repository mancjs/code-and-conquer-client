'use strict';

module.exports = (client, cell) => {
  const state = client.getState();
  state.socket.write(`attack ${state.key} ${cell}\n`);
};