import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Klinklang extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Klang';
  public cardType: CardType = M;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Emergency Rotation',
    powerType: PowerType.ABILITY,
    useFromHand: true,
    text: 'Once during your turn, if this Pokémon is in your hand and your opponent has any Stage 2 Pokémon in play, you may put this Pokémon onto your Bench.'
  }]

  public attacks = [
    {
      name: 'Hyper Ray',
      cost: [C, C],
      damage: 130,
      text: 'Discard all Energy from this Pokémon.'
    }
  ];

  public set: string = 'SCR';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Klinklang';
  public fullName: string = 'Klinklang SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (slots.length === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      let opponentHasStage2 = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
        if (card.stage == Stage.STAGE_2) {
          opponentHasStage2 = true
        }
      });

      if (opponentHasStage2) {
        const cards = player.hand.cards.filter(c => c.cards === this.cards);

        cards.forEach((card, index) => {
          player.hand.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
        });
      } else {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

    }

    return state;
  }
}