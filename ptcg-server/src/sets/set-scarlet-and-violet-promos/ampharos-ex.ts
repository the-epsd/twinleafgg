import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { Card, ChooseEnergyPrompt, ConfirmPrompt, GameMessage, State, StoreLike } from '../..';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Ampharosex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Flaaffy';

  public tags = [CardTag.POKEMON_ex];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 330;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Electro Ball',
      cost: [CardType.LIGHTNING],
      damage: 60,
      text: ''
    },
    {
      name: 'Thunderstrike Tail',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 140,
      damageCalculation: '+',
      text: 'You may discard 2 Energy from this Pokémon to have this attack do 100 more damage.'
    }
  ];

  public set: string = 'SVP';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public name: string = 'Ampharos ex';

  public fullName: string = 'Ampharos ex SVP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          state = store.reduceEffect(state, checkProvidedEnergy);

          state = store.prompt(state, new ChooseEnergyPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            checkProvidedEnergy.energyMap,
            [CardType.COLORLESS, CardType.COLORLESS],
            { allowCancel: false }
          ), energy => {
            const cards: Card[] = (energy || []).map(e => e.card);
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            effect.damage += 100;
            return state;
          });
          return state;
        }
        return state;
      });
      return state;
    }
    return state;
  }

}