import { TrainerCard, TrainerType, StoreLike, State, StateUtils, GamePhase, GameError, GameMessage, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardTag } from '../../game/store/card/card-types';

export class AntheaAndConcordia extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'I';

  public set: string = 'M2a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '173';

  public name: string = 'Anthea & Concordia';

  public fullName: string = 'Anthea & Concordia M2a';

  public extraPrizes = false;

  public text: string =
    'You can use this card only if you have N\'s Darmanitan, N\'s Zoroark ex, N\'s Vanilluxe, N\'s Klinklang, N\'s Reshiram, and N\'s Zekrom in play.' +
    '' +
    'During this turn, if your opponent\'s Active Pokémon is Knocked Out by damage from an attack used by your N\'s Pokémon, take 3 more Prize cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      // Check if all 6 required N's Pokémon are in play
      const requiredPokemon = [
        'N\'s Darmanitan',
        'N\'s Zoroark ex',
        'N\'s Vanilluxe',
        'N\'s Klinklang',
        'N\'s Reshiram',
        'N\'s Zekrom'
      ];

      const foundPokemon = new Set<string>();

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard) => {
        if (requiredPokemon.includes(pokemonCard.name)) {
          foundPokemon.add(pokemonCard.name);
        }
      });

      // Check if all required Pokémon are found
      if (foundPokemon.size !== requiredPokemon.length) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      this.extraPrizes = true;
      return state;
    }

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      // effect.player is the owner of the knocked out Pokémon (the opponent)
      const knockedOutPlayer = effect.player;
      const attacker = StateUtils.getOpponent(state, knockedOutPlayer);

      // Check if this card is in the attacker's supporter pile and was played this turn
      if (!attacker.supporter.cards.includes(this) || !this.extraPrizes) {
        return state;
      }

      // Do not activate between turns, or when it's not attacker's turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== attacker) {
        return state;
      }

      // Check if the knocked out Pokémon belongs to the opponent
      if (effect.target === knockedOutPlayer.active) {
        const attackingPokemon = attacker.active.getPokemonCard();

        // Check if attacking Pokémon is an N's Pokémon
        if (attackingPokemon) {
          const isNsPokemon = attackingPokemon.name.startsWith('N\'s') ||
            attackingPokemon.tags.includes(CardTag.NS);

          if (isNsPokemon && effect.prizeCount > 0) {
            effect.prizeCount += 3;
          }
        }
        this.extraPrizes = false;
        attacker.supporter.moveCardTo(this, attacker.discard);
      }
      return state;
    }
    return state;
  }
}
