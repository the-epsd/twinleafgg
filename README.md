# twinleaf.gg
# Pokemon Trading Card Game Simulator

The project is created to allow players of the Pokemon Trading Card Game to experience current and past formats that are not otherwise accesible in an online, web-based client.

There are two projects:

* **ptcg-server** is the game server. It is responsible for calculating the game state and propagating it to the connected clients by websockets.

* **ptcg-play** is a web application written in Angular. It displays the game state and allows interaction with the server.

### Server launch

Server is a simple node.js application written in TypeScript. It uses express with websockets and [typeorm](https://typeorm.io/#/) for database access.

Prerequisites:
* Node.js 16 or 18 LTS (Node 20+ is not supported by current engine constraints)
* npm 7+
* mysql-5 or sqlite-3

If you are currently on a newer Node version (for example Node 25), switch to Node 16 or 18 before installing dependencies.

Example using `n`:

```
npm install -g n
n 18
```

On macOS, if Node was installed through Homebrew, you may need to unlink it first:

```
brew unlink node
```

`config.js` contains all available options and its default values are defined in the `src/config.ts`

1. Go to the server directory and install dependencies.

```
cd ptcg-server
npm install
```

2. Add a file named `.env` in the `ptcg-server` directory. Paste these contents.

```
STORAGE_TYPE='sqlite'
STORAGE_DATABASE='database.sq3'
SERVER_PASSWORD=''
SERVER_SECRET='!secret!'
```

3. Start the server.

```
npm run start
```

The service should now listen on the specified address and port. It will be http://localhost:8080 by default. This can be changed by editing `config.js` as previously mentioned. This server uses Sqlite-3.

If you get a SQLite foreign key constraint error on startup, delete `ptcg-server/database.sq3` and start the server again. The database file will be regenerated.

### Client launch

The client is an Angular application.
https://angular.io/. 
The source code of the client is located in the `ptcg-play` directory.

The server package is a dependency required by the client. Make sure the server dependencies are installed and the server is running before starting the client.

1. With the server running, go to the `ptcg-play` directory and install dependencies.

```
cd ../ptcg-play
npm install
```

2. Build the client.

```
npm run build
```

3. Start the local client.

```
npm run start:local
```

The command above will start the application in the debug mode at http://localhost:4200

### Credits:

Foundation: Keeshii + TheEPSD
Based on: https://github.com/keeshii/ryuu-play

### License
MIT

-------

# **PR Rules for Contributing to twinleaf.gg**
*All instructions for setting up your dev environment can be found in the main branch readme.*
**Current formats we're looking to expand (in order of importance):**
1. Standard
2. Expanded
3. RSPK
4. Retro
5. GLC

When submitting PRs for **twinleaf**, cards *must* be tested by you before submitting. To ensure that we know they were tested, submit a screenshot.

Please stick to meta-relevant cards for the format you are submitting the card for. If you are submitting a card for RSPK for example, submitting a PR for a random evolution line that never saw play is not particularly useful as they won't be used. 

If you are submitting an evolution line, submit the entire evolution line in one PR. 

Submit 1 commit per-PR. The PR should include all new card files, as well as the updated index. 

Where possible, use prefabs first. If you do not know what this means or where to find it, go through the codebase more before submitting anything - as it means you may not be ready to contribute.

*All* PRs will be reviewed by me in a dev environment before being pushed to production. Any changes required will be done by the dev who originally submitted the PR.

When submitting a Pokémon, it must be formatted as followed:
```
stage
evolvesFrom [if applicable]
cardTag [if applicable]
cardType
hp
weakness
resistance [if applicable]
retreat

powers

attacks

*the order from this point on is optional but should include*
regulationMark [if applicable]
set
setNumber
cardImage (must always be set as `assets/cardback.png`)
name
fullName
```

*Always* use an energy type's short form, but *only* in the cards info section.
ex.
```public cardType: CardType = L;```
Use CardType.LIGHTNING in the reduceEffect.

When making an attack or ability where it states an energy type, it should be placed in square brackets. 
ex.
```text: 'Attach up to 2 [P] Energy cards from your discard pile to 1 of your Pokemon.'```


When submiting a Trainer card, it must be formatted as followed:
```
trainerType
cardTag [if applicable]
regulationMark
set
setNumber
cardImage (must always be set as `assets/cardback.png`)
name
fullName
text
```

When making a Trainer card where it states an energy type, it should be placed in square brackets. 
ex.
```'Attach a basic [D] Energy card from your discard pile to 1 of your Benched [D] Pokemon.';```

*Always* copy any text directly from a source that is formatted the same as the actual card.

*Do **NOT*** submit reprints of cards as their own isolated card file. Please see `other-prints` or `full-arts` for that. 

**NEVER** change the fullName property of an existing card. This property is stored throughout the database.
