'use strict';

/* 
 *  Game Events
 * 
 *  client.connected
 *  - The connection to the server was established.
 *
 *  client.disconnected
 *  - The connection to the server was lost.
 * 
 *  client.error
 *  - The client socket raised an error.
 * 
 *  raw.response
 *  - A raw protocol response was received.
 *  - Handle this if you want to do completely your own thing.
 * 
 *  query.gridUpdate
 *  - A grid state update was received.
 *  - Handle this if you want to manually analyse the new and previous grid states.
 * 
 *  query.cellConquered
 *  - The cell became owned by a new player.
 * 
 *  query.cellAttacked
 *  – The cell's health dropped, but is not yet conquered.
 * 
 *  query.cellDefended
 *  - The cell's health increased.
 * 
 *  game.mineTriggered
 *  - You triggered another team's mine and lost your remaining requests.
 *  – The owner of the mine will be passed with the event.
 * 
 *  game.requestsRemaining
 *  - Raised after a successful command to tell you how many requests you have left.
 *  - You have 30 requests every minute.
 * 
 *  game.err
 *  - Raised when your game command (attack, defend, role) does not succeed.
 *  - The specific error tells you more about why.
 */

module.exports = {
  client: {
    connected: 'client.connected',
    disconnected: 'client.disconnected',
    error: 'client.error'
  },
  raw: {
    response: 'raw.response'
  },
  query: {
    cellConquered: 'query.cell-conquered',
    cellAttacked: 'query.cell-attacked',
    cellDefended: 'query.cell-defended',
    gridUpdate: 'query.grid-update'
  },
  game: {
    mineTriggered: 'game.mine-triggered',
    requestsRemaining: 'game.requests-remaining'
  }
};