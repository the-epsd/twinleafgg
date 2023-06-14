"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitePlayerAction = void 0;
class InvitePlayerAction {
    constructor(clientId, name) {
        this.clientId = clientId;
        this.name = name;
        this.type = 'INVITE_PLAYER';
    }
}
exports.InvitePlayerAction = InvitePlayerAction;
