'use strict';

const client = require('./lib/client');
const events = require('./lib/events');

const attack = require('./lib/attack');
const defend = require('./lib/defend');
const role = require('./lib/role');

const MY_TEAM_NAME = 'team_name';
const MY_TEAM_KEY = 'key';

let gameState = {
  requests: 30
};

client.channel.once(events.client.disconnected, () => {
  console.log('error: client lost connection');
  process.exit(1);
});

client.channel.once(events.client.error, err => {
  console.log(err);
  process.exit(1);
});

client.channel.once(events.client.connected, socket => {
  // Keep hold of socket if you want to write commands manually on the wire.
  // You probably want to just use attack(), defend() and the role functions though.
});

client.channel.on(events.raw.response, res => {
  /*
   * We can do whatever we like with the raw responses.
   * Here we simply log them, as long as they're not query responses 
   * as we're already subscribing to the `events.query.gridUpdate` event below.
   */

  if (res.result && res.result.grid) {
    // It's a query resonse, don't log this.
    return;
  }

  console.log(`> ${JSON.stringify(res)}`);
});

client.channel.on(events.game.requestsRemaining, remaining => {
  // Keep track of how many requests we have left this period.
  gameState.requests = remaining;
});

client.channel.on(events.game.mineTriggered, mineOwner => {
  // You stepped on `mineOwner`'s mine.
  console.log(`triggered mine belonging to ${mineOwner}!`);
});

client.channel.on(events.query.cellAttacked, cell => {
  // The `cell`'s health just dropped (could have been caused by you).
  console.log(`cell ${cell.cellReference} attacked!`);
});

client.channel.on(events.query.cellDefended, cell => {
  // The `cell`'s health just increased (could have been caused by you).
  console.log(`cell ${cell.cellReference} defended!`);
});

client.channel.on(events.query.cellConquered, cell => {
  // The `cell` just became owned by someone new (could now be you).
  console.log(`cell ${cell.cellReference} conquered!`);
});

client.channel.on(events.query.gridUpdate, (oldGrid, newGrid) => {
  /*
   * Every time we get a grid update (every 5s), play a potential strategy.
   * Pass in the old and new grid states, in case our strategy will analyse them.
   * Also pass in `gameState` which keeps track of remaining requests and the socket.
   */

  playStrategy(oldGrid, newGrid, gameState);
});

const playStrategy = (oldGrid, newGrid, gameState) => {
  /*
   * In this example strategy, we just focus on acquiring cell 0,1.
   * 
   * First we need to make sure we haven't yet owned it, or we'd be
   * attacking our own cell.
   * 
   * As long as it's owned by someone else, we hit it with enough
   * attacks to conquer it.
   * 
   */

  const cell = newGrid[1][0];

  if (gameState.requests === 0) {
    // We have no requests left, so return and wait for next run.
    return;
  }

  if (cell.owner.name === MY_TEAM_NAME) {
    // We now own the cell, nothing more to do.
    return;
  }

  // We don't own it yet, so work out how many attacks to send.
  const requiredAttacks = cell.health < gameState.requests ? cell.health : gameState.requests; 

  // Fire!
  for (let i = 0; i < requiredAttacks; i++) {
    attack(client, '0,1');
  }
};

client.connect({ 
  host: 'localhost', 
  port: 9002, 
  key: MY_TEAM_KEY
});