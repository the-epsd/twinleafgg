import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Latios extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 110;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Glide',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: ''
    },
    {
      name: 'Luster Purge',
      cost: [ CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC ],
      damage: 180,
      text: 'Discard all Energy attached to this Pokemon.'
    }
  ];

  public set: string = 'PAR';

  public set2: string = 'paradoxrift';
  
  public setNumber: string = '73';

  public name: string = 'Latios';

  public fullName: string = 'Latios PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const cards = player.active.cards.filter(c => c instanceof EnergyCard);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      return store.reduceEffect(state, discardEnergy);
    }

    return state;
  }

}
