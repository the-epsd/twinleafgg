import { Format } from './card-types';
import { GreatBall as GreatBallRG } from '../../../sets/set-ex-firered-leafgreen/great-ball';
import { GreatBall as GreatBallPAL } from '../../../sets/set-paldea-evolved/great-ball';
import { MasterBall as MasterBallDX } from '../../../sets/set-ex-deoxys/master-ball';
import { MasterBall as MasterBallTEF } from '../../../sets/set-temporal-forces/master-ball';
import { PokemonFanClub as PokemonFanClubP4 } from '../../../sets/set-pop-series-4/pokemon-fan-club';
import { PokemonFanClub as PokemonFanClubUPR } from '../../../sets/set-ultra-prism/pokemon-fan-club';
// import { QuickBall as QuickBallMD } from '../../../sets/set-majestic-dawn/quick-ball';
// import { QuickBall as QuickBallSSH } from '../../../sets/set-sword-and-shield/quick-ball';
import { RareCandy as RareCandyHP } from '../../../sets/set-ex-holon-phantoms/rare-candy';
import { RareCandy as RareCandySVI } from '../../../sets/set-scarlet-and-violet/rare-candy';
// import { SuperRod as SuperRodNVI } from '../../../sets/set-noble-victories/super-rod';
// import { SuperRod as SuperRodPAL } from '../../../sets/set-paldea-evolved/super-rod';
import { PokemonCatcher as PokemonCatcherEPO } from '../../../sets/set-emerging-powers/pokemon-catcher';
import { PokemonCatcher as PokemonCatcherSVI } from '../../../sets/set-scarlet-and-violet/pokemon-catcher';
const effectOverrides = {
    // 'Super Rod': {
    //   [Format.RETRO]: SuperRodNVI.prototype.reduceEffect,
    //   default: SuperRodPAL.prototype.reduceEffect
    // }
    'Great Ball': {
        [Format.RSPK]: GreatBallRG.prototype.reduceEffect,
        default: GreatBallPAL.prototype.reduceEffect
    },
    'Master Ball': {
        [Format.RSPK]: MasterBallDX.prototype.reduceEffect,
        default: MasterBallTEF.prototype.reduceEffect
    },
    'Pokémon Fan Club': {
        [Format.RSPK]: PokemonFanClubP4.prototype.reduceEffect,
        default: PokemonFanClubUPR.prototype.reduceEffect
    },
    'Rare Candy': {
        [Format.RSPK]: RareCandyHP.prototype.reduceEffect,
        default: RareCandySVI.prototype.reduceEffect
    },
    // 'Quick Ball': {
    //   [Format.DP]: QuickBallMD.prototype.reduceEffect,
    //   default: QuickBallSSH.prototype.reduceEffect
    // },
    'Pokémon Catcher': {
        [Format.BW]: PokemonCatcherEPO.prototype.reduceEffect,
        default: PokemonCatcherSVI.prototype.reduceEffect
    },
};
export function getOverriddenReduceEffect(card, format) {
    const key = `${card.name}`;
    const overrides = effectOverrides[key];
    if (overrides) {
        if (overrides[format]) {
            return overrides[format].bind(card);
        }
        if (overrides.default) {
            return overrides.default.bind(card);
        }
    }
    return undefined;
}
