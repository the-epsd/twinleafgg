"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaGardevoirex = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaGardevoirex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 360;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Overflowing Wishes',
                cost: [P],
                damage: 0,
                text: 'For each of your Benched Pokemon, search your deck for a Basic [P] Energy and attach it to that Pokemon. Then, shuffle your deck.',
            },
            {
                name: 'Mega Symphonia',
                cost: [P],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each [P] Energy attached to all of your Pokemon.',
            }
        ];
        this.regulationMark = 'I';
        this.set = 'M1S';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Gardevoir ex';
        this.fullName = 'Mega Gardevoir ex M1S';
        this.MEGA_BRAVE_MARKER = 'MEGA_BRAVE_MARKER';
        this.CLEAR_MEGA_BRAVE_MARKER = 'CLEAR_MEGA_BRAVE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Overflowing Wishes
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            if (player.deck.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Psychic Energy' }, { allowCancel: false, differentTargets: true }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
            });
        }
        // Mega Symphonia
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    if (energy.provides.includes(game_1.CardType.PSYCHIC) || energy.provides.includes(game_1.CardType.ANY)) {
                        energies++;
                    }
                });
            });
            effect.damage = energies * 50;
        }
        return state;
    }
}
exports.MegaGardevoirex = MegaGardevoirex;
