"use strict";
exports.__esModule = true;
exports.InvitePlayerAction = void 0;
var InvitePlayerAction = /** @class */ (function () {
    function InvitePlayerAction(clientId, name) {
        this.clientId = clientId;
        this.name = name;
        this.type = 'INVITE_PLAYER';
    }
    return InvitePlayerAction;
}());
exports.InvitePlayerAction = InvitePlayerAction;
