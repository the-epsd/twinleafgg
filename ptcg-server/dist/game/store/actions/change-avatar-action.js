export class ChangeAvatarAction {
    constructor(id, avatarName, log) {
        this.id = id;
        this.avatarName = avatarName;
        this.log = log;
        this.type = 'CHANGE_AVATAR';
    }
}
