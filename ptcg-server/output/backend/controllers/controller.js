"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.Get = exports.Controller = void 0;
class Controller {
    constructor(path, app, db, core) {
        this.path = path;
        this.app = app;
        this.db = db;
        this.core = core;
    }
    init() { }
    buildUserInfo(user) {
        const connected = this.core.clients
            .some(c => c.user.id === user.id);
        return {
            userId: user.id,
            name: user.name,
            email: user.email,
            ranking: user.ranking,
            rank: user.getRank(),
            registered: user.registered,
            lastSeen: user.lastSeen,
            lastRankingChange: user.lastRankingChange,
            avatarFile: user.avatarFile,
            connected
        };
    }
    escapeLikeString(raw, escapeChar = '\\') {
        return raw.replace(/[\\%_]/g, match => escapeChar + match);
    }
}
exports.Controller = Controller;
function Get(path) {
    return function (target, propertyKey, descriptor) {
        const init = target.init;
        target.init = function () {
            init.call(this);
            this.app.get(`${this.path}${path}`, descriptor.value.bind(this));
        };
    };
}
exports.Get = Get;
function Post(path) {
    return function (target, propertyKey, descriptor) {
        const init = target.init;
        target.init = function () {
            init.call(this);
            this.app.post(`${this.path}${path}`, descriptor.value.bind(this));
        };
    };
}
exports.Post = Post;
