"use strict";
exports.__esModule = true;
exports.ChangeAvatarAction = void 0;
var ChangeAvatarAction = /** @class */ (function () {
    function ChangeAvatarAction(id, avatarName, log) {
        this.id = id;
        this.avatarName = avatarName;
        this.log = log;
        this.type = 'CHANGE_AVATAR';
    }
    return ChangeAvatarAction;
}());
exports.ChangeAvatarAction = ChangeAvatarAction;
