"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardevoirex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gardevoirex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Psychic Embrace',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), ' +
                    'you may attach a P Energy card from your discard pile to 1 of your Pokemon.'
            }];
        this.attacks = [
            {
                name: 'Miracle Force',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 190,
                text: 'This Pokémon recovers from all Special Conditions.'
            }
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Gardevoir ex';
        this.fullName = 'Gardevoir ex SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // const blocked: CardTarget[] = [];
            // player.bench.forEach((card, index) => {
            //   if (card instanceof PokemonCard && card.cardType !== CardType.PSYCHIC) {
            //     blocked.push();
            //   }
            // });
            // player.active.cards.forEach((card, index) => {
            //   if (card instanceof PokemonCard && card.cardType !== CardType.PSYCHIC) {
            //     blocked.push();
            //   }
            // });
            state = store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { allowCancel: true, min: 0 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const checkHpEffect = new check_effects_1.CheckHpEffect(player, target);
                    store.reduceEffect(state, checkHpEffect);
                    if (target.cards[0] instanceof pokemon_card_1.PokemonCard && target.cards[0].cardType !== card_types_1.CardType.PSYCHIC) {
                        throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_ATTACH_TO_PSYCHIC);
                    }
                    const damageAfterTransfer = target.damage + 20;
                    if (damageAfterTransfer >= checkHpEffect.hp) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    player.discard.moveCardTo(transfer.card, target);
                    target.damage += 20;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const removeSpecialCondition = new attack_effects_1.RemoveSpecialConditionsEffect(effect, undefined);
            removeSpecialCondition.target = player.active;
            state = store.reduceEffect(state, removeSpecialCondition);
            return state;
        }
        return state;
    }
}
exports.Gardevoirex = Gardevoirex;
