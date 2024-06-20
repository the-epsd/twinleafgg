"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Munkidori = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const remove_damage_prompt_1 = require("../../game/store/prompts/remove-damage-prompt");
class Munkidori extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 110;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Adrena-Brain',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon has any [D] Energy attached, you may move up to 3 damage counters from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Mind Bend',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS],
                damage: 60,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Munkidori';
        this.fullName = 'Munkidori TWM';
        this.ADRENA_BRAIN_MARKER = 'ADRENA_BRAIN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ADRENA_BRAIN_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.ADRENA_BRAIN_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.ADRENA_BRAIN_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // const blocked: CardTarget[] = [];
            // let hasPokemonWithDamage: boolean = false;
            // player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            //   if (cardList.damage === 0) {
            //     blocked.push();
            //   }
            //   player.active.cards.forEach((card, index) => {
            //     if (card instanceof PokemonCardList && card.damage == 0) {
            //       blocked.push();
            //     } else {
            //       hasPokemonWithDamage = true;
            //     }
            //   });
            //   if (hasPokemonWithDamage === false) {
            //     throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            //   }
            player.marker.addMarker(this.ADRENA_BRAIN_MARKER, this);
            const maxAllowedDamage = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                maxAllowedDamage.push({ target, damage: card.hp + 10 });
            });
            const damage = 10;
            return store.prompt(state, new remove_damage_prompt_1.RemoveDamagePrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
                const results = targets || [];
                for (const result of results) {
                    const target = game_1.StateUtils.getTarget(state, player, result.target);
                    const healEffect = new game_effects_1.HealEffect(player, target, result.damage);
                    state = store.reduceEffect(state, healEffect);
                    healEffect.target = target;
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false }), selected => {
                        const targets = selected || [];
                        targets.forEach(target => {
                            target.damage += result.damage;
                        });
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                cardList.addSpecialCondition(game_1.SpecialCondition.ABILITY_USED);
                            }
                        });
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Munkidori = Munkidori;
