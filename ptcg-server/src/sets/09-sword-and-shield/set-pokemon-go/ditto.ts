import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  PowerType,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COPY_ATTACK_VIA_ABILITY } from '../../../game/store/prefabs/copy-attack-prefabs';
import { WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Ditto extends PokemonCard {
  public regulationMark = 'F';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [
    {
      name: 'Sudden Transformation',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: 'This Pokémon can use the attacks of any Basic Pokémon in your discard pile, except for Pokémon with a Rule Box (Pokémon V, Pokémon-GX, etc. have Rule Boxes). (You still need the necessary Energy to use each attack.)',
    },
  ];

  public set: string = 'PGO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Ditto';
  public fullName: string = 'Ditto PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const extraCards = player.discard.cards.filter(
        (card): card is PokemonCard =>
          card instanceof PokemonCard && card.stage === Stage.BASIC && !card.hasRuleBox(),
      );
      return COPY_ATTACK_VIA_ABILITY(store, state, effect, {
        copycatCard: this,
        extraCards,
      });
    }
    return state;
  }
}
