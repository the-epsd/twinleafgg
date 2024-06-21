"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WurmpleArt = exports.WinonaArt = exports.WallyArt = exports.TrainersMailArt = exports.SkyFieldArt = exports.SilcoonArt = exports.ShuppetArt = exports.ShayminExArt = exports.BeautiflyArt = exports.ArticunoArt = void 0;
const articuno_1 = require("./articuno");
const beautifly_1 = require("./beautifly");
const shaymin_ex_1 = require("./shaymin-ex");
const shuppet_1 = require("./shuppet");
const silcoon_1 = require("./silcoon");
const sky_field_1 = require("./sky-field");
const trainers_mail_1 = require("./trainers-mail");
const wally_1 = require("./wally");
const winona_1 = require("./winona");
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
class ShuppetArt extends shuppet_1.Shuppet {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_030_R_EN_LG.png';
    }
}
exports.ShuppetArt = ShuppetArt;
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
class WallyArt extends wally_1.Wally {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_094_R_EN_LG.png';
    }
}
exports.WallyArt = WallyArt;
class WinonaArt extends winona_1.Winona {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_096_R_EN_LG.png';
    }
}
exports.WinonaArt = WinonaArt;
class WurmpleArt extends wurmple_1.Wurmple {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ROS/ROS_003_R_EN.png';
    }
}
exports.WurmpleArt = WurmpleArt;
