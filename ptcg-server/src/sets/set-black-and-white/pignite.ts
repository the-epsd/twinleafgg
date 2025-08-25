import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ATTACH_ENERGY_PROMPT, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PlayerType, SlotType } from '../../game';

export class Pignite extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tepig';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Flame Charge',
      cost: [C],
      damage: 0,
      text: 'Search your deck for a [R] Energy card and attach it to this Pokémon. Shuffle your deck afterward.'
    },
    {
      name: 'Heat Crash',
      cost: [R, R, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public name: string = 'Pignite';
  public fullName: string = 'Pignite BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      if (!cardList) return state;
      state = ATTACH_ENERGY_PROMPT(
        store,
        state,
        player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.DECK,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 1, max: 1, allowCancel: true }
      );
      return SHUFFLE_DECK(store, state, player);
    }
    return state;
  }

}
