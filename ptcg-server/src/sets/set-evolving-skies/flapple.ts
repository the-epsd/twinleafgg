import { PowerType, State, StateUtils, StoreLike, PlayerType } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';

import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Flapple extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 80;

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Acidic Mucus',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage for each of your opponent\'s Pokémon in play that has an Ability.'
    },
    {
      name: 'Fighting Tackle',
      cost: [CardType.GRASS, CardType.FIRE],
      damage: 80,
      text: 'If your opponent\'s Active Pokémon is a Pokémon V, this attack does 80 more damage.'
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public name: string = 'Flapple';

  public fullName: string = 'Flapple EVS';

  public evolvesFrom = 'Applin';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let abilityCount = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList.getPokemonCard()) {
          const powersEffect = new CheckPokemonPowersEffect(opponent, card);
          state = store.reduceEffect(state, powersEffect);
          if (powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
            abilityCount++;
          }
        }
      });

      effect.damage += abilityCount * 50;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard() &&
        (opponent.active.getPokemonCard()!.tags.includes(CardTag.POKEMON_V) ||
          opponent.active.getPokemonCard()!.tags.includes(CardTag.POKEMON_VMAX) ||
          opponent.active.getPokemonCard()!.tags.includes(CardTag.POKEMON_VSTAR))) {
        effect.damage += 80;
      }

      return state;
    }

    return state;
  }

}
