# Code & Conquer Client

## How It Works

+ The client connects to the game server.

+ It starts the query engine, which fetches a grid update every 5 seconds.

+ The example `run.js` calls a strategy function `playStrategy` each time it receives the `events.query.gridUpdate` event. You can of course trigger your strategy in any way you like.

+ On `client.channel`, the following events are raised to inform you about the continuing state of the game:
  + `events.raw.response` is raised for literally every protocol response. You can catch everything here and do any kind of manual strategy.

  + `events.game.requestsRemaining` is raised to tell you how many requests you have left in the current period.

  + `events.query.gridUpdate` is raised for every grid update fetched (every 5s). You are passed the prior and current grid states so you can work out what happened and act accordingly. Alternatively you can listen to the higher-level events described below.

  + `events.game.mineTriggered` is raised when one of your commands triggers a mine set by another user. The owner of the mine is passed with the event.

  + `events.query.cellAttacked` is raised for every cell which lost health points since the last grid update.

  + `events.query.cellDefended` is raised for every cell which gained health points since the last grid update.

  + `events.query.cellConquered` is raised for every cell which became owned by a different player since the last grid update. 
  