import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class AlolanVulpixV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.WATER;

  public hp: number = 190;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'White Drop',
      cost: [],
      damage: 10,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is a Pokémon V, this attack does 50 more damage.'
    },
    {
      name: 'Frost Smash',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'SIT';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '33';

  public name: string = 'Alolan Vulpix V';

  public fullName: string = 'Alolan Vulpix V SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const defending = opponent.active.getPokemonCard();
      if (!defending || defending.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX)) {
        effect.damage += 50;
        return state;
      }
      return state;
    }
    return state;
  }
}