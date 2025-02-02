import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Articuno extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = W;

  public hp: number = 120;

  public weakness = [{ type: M }];

  public retreat = [C, C];

  public powers = [{
    name: 'Ice Symbol',
    powerType: PowerType.ABILITY,
    text: 'Your Basic [W] Pokémon\'s attacks, except any Articuno, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Freezing Wind',
      cost: [W, W, C],
      damage: 110,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'PGO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '24';

  public name: string = 'Articuno';

  public fullName: string = 'Articuno PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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

      const hasArticunoInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
      let numberOfArticunoInPlay = 0;

      if (hasArticunoInPlay) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.cards.includes(this)) {
            numberOfArticunoInPlay++;
          }
        });
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(W) && effect.target === opponent.active) {
        if (effect.player.active.getPokemonCard()?.name !== 'Articuno' && effect.player.active.getPokemonCard()?.stage === Stage.BASIC) {
          effect.damage += 10 * numberOfArticunoInPlay;
        }
      }


    }
    return state;
  }
}