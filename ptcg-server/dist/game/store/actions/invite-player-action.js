export class InvitePlayerAction {
    constructor(clientId, name) {
        this.clientId = clientId;
        this.name = name;
        this.type = 'INVITE_PLAYER';
    }
}
