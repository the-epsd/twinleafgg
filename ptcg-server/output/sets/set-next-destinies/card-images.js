"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelBallNXD = void 0;
const level_ball_1 = require("./level-ball");
class LevelBallNXD extends level_ball_1.LevelBall {
    constructor() {
        super(...arguments);
        this.fullName = 'Level Ball NXD';
        this.set = 'NXD';
        this.setNumber = '89';
    }
}
exports.LevelBallNXD = LevelBallNXD;
