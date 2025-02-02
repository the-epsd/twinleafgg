# Twinleaf.gg Open Source Project
# PTCG Simulator

The project is created to allow players of the PTCG to experience current and past formats that are not otherwise accesible in an online, web-based client.

**Submitting PRs**
Pull Requests will only be approved for new cards, and must be done in a new branch. Any engine/server upgrades/extensions should be discussed with the twinleaf team on Discord - https://discord.com/invite/Y9XKnC8dE5

There are two projects:

* **ptcg-server** is the game server. It is responsible for calculating the game state and propagating it to the connected clients by websockets.

* **ptcg-play** is a web application written in Angular. It displays the game state and allows interaction with the server.

### Server launch

Server is a simple node.js application written in TypeScript. It uses express with websockets and [typeorm](https://typeorm.io/#/) for database access.

Prerequisites:
* Node.js v16.20.2
* mysql-5 or sqlite3

Note: The project is configured to work with mysql, but the original project used Sqlite3. The database structure is in a database.sq3 file

`config.js` contains all available options and its default values are defined in the `src/config.ts`
`.env` will also need to be configured in order to work.

1. Install all required dependencies.

```
npm install
```

2. Build the project and start it.

```
npm run build
npm start
```

The service should now listen on the specified address and port. It will be http://localhost:8080 by default. This can be changed by editing `config.js` as previously mentioned. This server uses Sqlite-3.

### Client launch

The client is an Angular application.
https://angular.io/. 
The source code of the client is located in the `ptcg-play` directory.

The server package is a dependency required by the client. First you must build the server, then the client.

1. When the server is running, you can go now to the `ptcg-play` directory and install dependencies.

```
npm install
```

2. Start the aplication.

```
npm start
```

The command above will start the application in the debug mode at http://localhost:4200

### Credits:

Foundation: Keeshii + TheEPSD
Twinleaf.gg is a fork of Keeshii's Ryuu-Play which can be found at https://github.com/keeshii/ryuu-play

### License
MIT
