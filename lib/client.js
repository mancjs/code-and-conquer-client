'use strict';

const { EventEmitter } = require('events');
const net = require('net');

const events = require('./events');
const query = require('./query');
const statuses = require('./statuses');

const state = {
  channel: new EventEmitter(),
  socket: null,
  key: null
};

const getState = () => {
  return state;
};

const emit = (event, args) => {
  state.channel.emit(event, args);
};

const parseAndEmitRawResponse = json => {
  try {
    const data = JSON.parse(json);

    if (data.status === statuses.okMineTriggered) {
      emit(events.game.mineTriggered, data.result.owner);
    }

    if (data.result && data.result.requestsRemaining !== undefined) {
      emit(events.game.requestsRemaining, data.result.requestsRemaining);
    }

    emit(events.raw.response, data);
  } catch (err) { }
};

const parseResponseData = buffer => {
  const responses = buffer.split('\n');

  for (let i = 0; i < responses.length - 1; i++) {
    parseAndEmitRawResponse(responses[i]);
  }

  return responses[responses.length - 1];
};

const connect = config => {
  let buffer = '';

  state.key = config.key;

  state.socket = net.createConnection(config, () => {
    emit(events.client.connected, state.socket);
    query.start(state);
  });

  state.socket.on('data', chunk => {
    buffer += chunk.toString();
    buffer = parseResponseData(buffer);
  });

  state.socket.on('end', () => {
    emit(events.client.disconnected);
    query.stop();
  });

  state.socket.on('close', () => {
    emit(events.client.disconnected);
    query.stop();
  });

  state.socket.on('error', err => {
    emit(events.client.error, err);
  });
};

module.exports = {
  getState,
  connect,
  channel: state.channel
};