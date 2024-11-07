import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class Moltres extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 120;

  public weakness = [{ type: W }];

  public retreat = [C, C];

  public powers = [{
    name: 'Flare Symbol',
    powerType: PowerType.ABILITY,
    text: 'Your Basic [R] Pokémon\'s attacks, except any Moltres, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Fire Wing',
      cost: [R, R, C],
      damage: 110,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'PGO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '12';

  public name: string = 'Moltres';

  public fullName: string = 'Moltres PGO';

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

      const hasMoltresInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
      let numberOfMoltresInPlay = 0;

      if (hasMoltresInPlay) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.cards.includes(this)) {
            numberOfMoltresInPlay++;
          }
        });
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (checkPokemonTypeEffect.cardTypes.includes(R) && effect.target === opponent.active) {
        if (effect.player.active.getPokemonCard()?.name !== 'Moltres' && effect.player.active.getPokemonCard()?.stage === Stage.BASIC) {
          effect.damage += 10 * numberOfMoltresInPlay;
        }
      }
    }
    return state;
  }
}