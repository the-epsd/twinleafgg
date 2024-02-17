"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WurmpleArt = exports.TrainersMailArt = exports.SkyFieldArt = exports.SilcoonArt = exports.ShayminExArt = exports.BeautiflyArt = exports.ArticunoArt = void 0;
const articuno_1 = require("./articuno");
const beautifly_1 = require("./beautifly");
const shaymin_ex_1 = require("./shaymin-ex");
const silcoon_1 = require("./silcoon");
const sky_field_1 = require("./sky-field");
const trainers_mail_1 = require("./trainers-mail");
const wurmple_1 = require("./wurmple");
class ArticunoArt extends articuno_1.Articuno {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_017_R_EN.png';
    }
}
exports.ArticunoArt = ArticunoArt;
class BeautiflyArt extends beautifly_1.Beautifly {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_005_R_EN.png';
    }
}
exports.BeautiflyArt = BeautiflyArt;
class ShayminExArt extends shaymin_ex_1.ShayminEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_077_R_EN.png';
    }
}
exports.ShayminExArt = ShayminExArt;
class SilcoonArt extends silcoon_1.Silcoon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_004_R_EN.png';
    }
}
exports.SilcoonArt = SilcoonArt;
class SkyFieldArt extends sky_field_1.SkyField {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_089_R_EN.png';
    }
}
exports.SkyFieldArt = SkyFieldArt;
class TrainersMailArt extends trainers_mail_1.TrainersMail {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_092_R_EN.png';
    }
}
exports.TrainersMailArt = TrainersMailArt;
class WurmpleArt extends wurmple_1.Wurmple {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_003_R_EN.png';
    }
}
exports.WurmpleArt = WurmpleArt;
