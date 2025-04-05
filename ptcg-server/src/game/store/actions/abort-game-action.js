"use strict";
exports.__esModule = true;
exports.AbortGameAction = exports.AbortGameReason = void 0;
var AbortGameReason;
(function (AbortGameReason) {
    AbortGameReason[AbortGameReason["TIME_ELAPSED"] = 0] = "TIME_ELAPSED";
    AbortGameReason[AbortGameReason["ILLEGAL_MOVES"] = 1] = "ILLEGAL_MOVES";
    AbortGameReason[AbortGameReason["DISCONNECTED"] = 2] = "DISCONNECTED";
})(AbortGameReason = exports.AbortGameReason || (exports.AbortGameReason = {}));
var AbortGameAction = /** @class */ (function () {
    function AbortGameAction(culpritId, reason) {
        this.culpritId = culpritId;
        this.reason = reason;
        this.type = 'ABORT_GAME';
    }
    return AbortGameAction;
}());
exports.AbortGameAction = AbortGameAction;
