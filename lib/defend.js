'use strict';

module.exports = (client, cell) => {
  const state = client.getState();
  state.socket.write(`defend ${state.key} ${cell}\n`);
};