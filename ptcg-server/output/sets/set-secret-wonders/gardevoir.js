"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gardevoir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gardevoir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = P;
        this.hp = 110;
        this.weakness = [{ type: P, value: +30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Telepass',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may search your opponent\’s discard pile for a Supporter card and use the effect of that card as the effect of this power. (The Supporter card remains in your opponent\’s discard pile.) You can\’t use more than 1 Telepass Poké-Power each turn. This power can\’t be used if Gardevoir is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Psychic Lock',
                cost: [P, C, C],
                damage: 60,
                text: 'During your opponent\’s next turn, your opponent can\’t use any Poké-Powers on his or her Pokémon.'
            }
        ];
        this.set = 'SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Gardevoir';
        this.fullName = 'Gardevoir SW';
        this.TELEPASS_MARKER = 'TELEPASS_MARKER';
        this.PSCHIC_LOCK_MARKER = 'PSYCHIC_LOCK_MARKER';
    }
    reduceEffect(store, state, effect) {
        //Telepass
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const supportersInDiscard = opponent.discard.cards.filter(card => {
                card instanceof game_1.TrainerCard && card.trainerType === card_types_1.TrainerType.SUPPORTER;
            });
            if (!supportersInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            //One per turn only
            if (prefabs_1.HAS_MARKER(this.TELEPASS_MARKER, player)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            //Do not allow if affected by a Special Condition
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.ADD_MARKER(this.TELEPASS_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_COPY_EFFECT, opponent.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { allowCancel: false, min: 1, max: 1 }), cards => {
                const trainerCard = cards[0];
                const playTrainerEffect = new play_card_effects_1.TrainerEffect(player, trainerCard);
                store.reduceEffect(state, playTrainerEffect);
            });
        }
        //Attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_MARKER(this.PSCHIC_LOCK_MARKER, opponent, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && prefabs_1.HAS_MARKER(this.PSCHIC_LOCK_MARKER, effect.player)) {
            throw new game_1.GameError(game_1.GameMessage.ABILITY_BLOCKED);
        }
        //Remove Markers
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.TELEPASS_MARKER, this);
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.PSCHIC_LOCK_MARKER, this);
        return state;
    }
}
exports.Gardevoir = Gardevoir;
