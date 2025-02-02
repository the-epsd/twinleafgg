"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cherrim = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Cherrim extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'E';
        this.evolvesFrom = 'Cherubi';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Spring Bloom',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn, you may attach a ' +
                    'G Energy card from your hand to 1 of your Pokémon ' +
                    'that doesn’t have a Rule Box (Pokémon V, Pokémon-GX, ' +
                    'etc. have Rule Boxes).'
            }];
        this.attacks = [
            {
                name: 'Seed Bomb',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Cherrim';
        this.fullName = 'Cherrim BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.GRASS);
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                    blocked2.push(target);
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)) {
                    blocked2.push(target);
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    blocked2.push(target);
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                    blocked2.push(target);
                }
                if (card.tags.includes(card_types_1.CardTag.RADIANT)) {
                    blocked2.push(target);
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_GX)) {
                    blocked2.push(target);
                }
                if (card.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                    blocked2.push(target);
                }
            });
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: false, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const energyCard = transfer.card;
                    const attachEnergyEffect = new play_card_effects_1.AttachEnergyEffect(player, energyCard, target);
                    store.reduceEffect(state, attachEnergyEffect);
                }
            });
        }
        return state;
    }
}
exports.Cherrim = Cherrim;
