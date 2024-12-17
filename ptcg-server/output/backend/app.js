"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const body_parser_1 = require("body-parser");
const express = require("express");
const config_1 = require("../config");
const core_1 = require("../game/core/core");
const storage_1 = require("../storage");
const cors_1 = require("./services/cors");
const websocket_server_1 = require("./socket/websocket-server");
const controllers_1 = require("./controllers");
class App {
    constructor() {
        this.core = new core_1.Core();
        this.storage = new storage_1.Storage();
        this.app = this.configureExpress();
        this.ws = this.configureWebSocket();
    }
    configureExpress() {
        const storage = this.storage;
        const core = this.core;
        const app = express();
        const define = function (path, controller) {
            const instance = new controller(path, app, storage, core);
            instance.init();
        };
        app.use(body_parser_1.json({ limit: 512 + config_1.config.backend.avatarFileSize * 4 }));
        app.use(cors_1.cors());
        define('/v1/avatars', controllers_1.Avatars);
        define('/v1/cards', controllers_1.Cards);
        define('/v1/decks', controllers_1.Decks);
        define('/v1/game', controllers_1.Game);
        define('/v1/login', controllers_1.Login);
        define('/v1/messages', controllers_1.Messages);
        define('/v1/profile', controllers_1.Profile);
        define('/v1/ranking', controllers_1.Ranking);
        define('/v1/replays', controllers_1.Replays);
        define('/v1/resetPassword', controllers_1.ResetPassword);
        if (config_1.config.sets.scansDir) {
            app.use('/scans', express.static(config_1.config.sets.scansDir));
        }
        app.use('/avatars', express.static(config_1.config.backend.avatarsDir));
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });
        return app;
    }
    configureWebSocket() {
        var _a;
        const ws = new websocket_server_1.WebSocketServer(this.core);
        (_a = ws.server) === null || _a === void 0 ? void 0 : _a.on('error', (error) => {
            console.error(error);
        });
        return ws;
    }
    connectToDatabase() {
        return this.storage.connect();
    }
    configureBotManager(botManager) {
        botManager.initBots(this.core);
    }
    start() {
        const address = config_1.config.backend.address;
        const port = config_1.config.backend.port;
        const httpServer = this.app.listen(port, address, () => {
            console.log(`Server listening on ${address}:${port}.`);
        });
        this.ws.listen(httpServer);
    }
}
exports.App = App;
