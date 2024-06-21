import { Card, ChooseEnergyPrompt, GameMessage, Power, PowerType, State, StoreLike, Weakness } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Reshiram extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.DRAGON;
  
  public weakness: Weakness[] = [{ type: CardType.FAIRY }];
  
  public hp: number = 130;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers: Power[] = [
    {
      name: 'Turboblaze',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may attach a [R] Energy card from your hand to 1 of your [N] Pokémon.'
    }
  ]
  
  public attacks = [
    {
      name: 'Bright Wing',
      cost: [CardType.FIRE, CardType.FIRE, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 110,
      text: 'Discard a [R] Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'ROS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';

  public name: string = 'Reshiram';

  public fullName: string = 'Reshiram ROS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      
      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [ CardType.FIRE ],
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
