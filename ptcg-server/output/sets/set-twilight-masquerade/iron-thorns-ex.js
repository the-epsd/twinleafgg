"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronThornsex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class IronThornsex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.FUTURE];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Initialization',
                powerType: game_1.PowerType.ABILITY,
                exemptFromInitialize: true,
                text: 'While this Pokémon is in the Active Spot, Pokémon with a Rule Box in play (except any Future Pokémon) don\'t have any Abilities.'
            }];
        this.attacks = [
            {
                name: 'Volt Cyclone',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 140,
                text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Iron Thorns ex';
        this.fullName = 'Iron Thorns ex TWM';
        this.BOLT_CYCLONE_MARKER = 'BOLT_CYCLONE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === game_1.PowerType.ABILITY && effect.power.name !== 'Initialization') {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const ruleBoxTags = [
                card_types_1.CardTag.POKEMON_ex,
                card_types_1.CardTag.POKEMON_V,
                card_types_1.CardTag.POKEMON_VSTAR,
                card_types_1.CardTag.POKEMON_VMAX,
                card_types_1.CardTag.RADIANT
            ];
            // Iron Thorns ex is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            // Pokemon isn't a rule box - don't bother checking to block ability
            if (!ruleBoxTags.some(tag => effect.card.tags.includes(tag))) {
                return state;
            }
            // Try reducing ability for each player  
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.player.marker.addMarker(this.BOLT_CYCLONE_MARKER, this);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BOLT_CYCLONE_MARKER, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            // Then prompt for energy movement
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
                effect.player.marker.removeMarker(this.BOLT_CYCLONE_MARKER, this);
            });
        }
        return state;
    }
}
exports.IronThornsex = IronThornsex;
