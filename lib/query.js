'use strict';

const events = require('./events');

const state = {
  interval: null,
  lastGrid: null
};

const generateGridEvents = (channel, grid) => {
  if (!state.lastGrid) {
    return;
  }

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const oldCell = state.lastGrid[y][x];
      const newCell = grid[y][x];
      
      newCell.cellReference = `${x},${y}`;

      if (newCell.owner.name !== oldCell.owner.name) {
        channel.emit(events.query.cellConquered, newCell);
      } else if (newCell.health < oldCell.health) {
        channel.emit(events.query.cellAttacked, newCell);
      } else if (newCell.health > oldCell.health) {
        channel.emit(events.query.cellDefended, newCell);
      }
    }
  }

  channel.emit(events.query.gridUpdate, state.lastGrid, grid);
};

const sendQuery = (key, socket) => {
  if (socket.writable) {
    socket.write(`query ${key}\n`);
  }
};

const start = ({ socket, channel, key }) => {
  state.interval = setInterval(() => {
    sendQuery(key, socket);
  }, 5000);

  channel.on(events.raw.response, data => {
    if (data.result && data.result.grid) {
      generateGridEvents(channel, data.result.grid);
      state.lastGrid = data.result.grid;
    }
  });
};

const stop = () => {
  clearInterval(state.interval);
};

module.exports = {
  start,
  stop
};