import { PokemonCard, Stage, CardType, PowerType, ConfirmPrompt, GameLog, GameMessage, PlayerType, State, StoreLike, BoardEffect } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
export class Togepi extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public powers = [
    {
      name: 'Touch of Happiness',
      powerType: PowerType.ABILITY,
      text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may heal 10 damage from your Active Pokémon.'
    }
  ];

  public attacks = [
    {
      name: 'Rollout',
      cost: [P],
      damage: 10,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'ASR';
  public setNumber: string = '55';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Togepi';
  public fullName: string = 'Togepi ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

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
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Touch of Happiness' });
            }
          });

          const healEffect = new HealEffect(player, effect.player.active, 30);
          store.reduceEffect(state, healEffect);

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });
        }
      });
    }
    return state;
  }
}