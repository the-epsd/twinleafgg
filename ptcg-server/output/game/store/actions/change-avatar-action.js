"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeAvatarAction = void 0;
class ChangeAvatarAction {
    constructor(id, avatarName, log) {
        this.id = id;
        this.avatarName = avatarName;
        this.log = log;
        this.type = 'CHANGE_AVATAR';
    }
}
exports.ChangeAvatarAction = ChangeAvatarAction;
