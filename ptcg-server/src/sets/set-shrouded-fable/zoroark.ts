import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, StateUtils } from '../../game';

export class Zoroark extends PokemonCard {

  public regulationMark = 'H';

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Zorua';

  public cardType = CardType.DARK;

  public hp = 120;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Illusory Hijacking',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      damageCalculation: 'x',
      text: 'This attack does 60 damage for each of your opponent\'s Pokémon ex and Pokémon V in play.'
    },
    {
      name: 'Claw Slash',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 110,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public name: string = 'Zoroark';

  public fullName: string = 'Zoroark SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let opponentExOrV = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (card.tags.includes(CardTag.POKEMON_ex)) {
          opponentExOrV++;
        }
        if (card.tags.includes(CardTag.POKEMON_V)) {
          opponentExOrV++;
        }
        if (card.tags.includes(CardTag.POKEMON_VMAX)) {
          opponentExOrV++;
        }
        if (card.tags.includes(CardTag.POKEMON_VSTAR)) {
          opponentExOrV++;
        }
      });
      effect.damage = 60 * opponentExOrV;
    }
    return state;
  }
}
