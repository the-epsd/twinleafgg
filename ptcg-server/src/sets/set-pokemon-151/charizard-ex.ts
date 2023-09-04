/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseEnergyPrompt, GameMessage
   } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Charizardex extends PokemonCard {

  public tags = [ CardTag.POKEMON_ex ];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charmeleon';

  public cardType: CardType = CardType.DARK;

  public hp: number = 330;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Brave Wing',
      cost: [ CardType.FIRE ],
      damage: 60,
      text: 'If this Pokémon has any damage counters on it, this attack ' +
      'does 100 more damage.'
    },
    {
        name: 'Explosive Vortex',
        cost: [ CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE ],
        damage: 330,
        text: 'Discard 3 Energy from this Pokémon. '
      },
  ];

  public set: string = '151';

  public name: string = 'Charizard ex';

  public fullName: string = 'Charizard ex';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

    const player = effect.player;
    const source = player.active;
  
    // Check if source Pokemon has damage
    const damage = source.damage;
    if (damage > 0) {
      effect.damage += 100; 
    }
  
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        const player = effect.player;
  
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
        state = store.reduceEffect(state, checkProvidedEnergy);
  
        state = store.prompt(state, new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
          { allowCancel: false }
        ), energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          return store.reduceEffect(state, discardEnergy);
        });
      }
  
      return state;
    }
  
  return state;
}
}