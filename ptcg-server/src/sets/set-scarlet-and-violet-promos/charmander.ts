import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseEnergyPrompt, GameMessage, Card } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Charmander extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = R;

  public hp: number = 70;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [{
    name: 'Ember',
    // cost: [CardType.FIRE, CardType.FIRE],
    cost: [R, R],
    damage: 40,
    text: 'Discard an Energy from this Pokémon.',
  },
  ];

  public set: string = 'SVP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '47';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander SVP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [C],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }
    return state;
  }
}