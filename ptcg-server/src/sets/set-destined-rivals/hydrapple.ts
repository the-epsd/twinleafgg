import { ChooseCardsPrompt, EnergyCard, GameMessage } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Hydrapple extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dipplin';
  public regulationMark = 'I';
  public cardType: CardType = G;
  public hp: number = 170;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Hydra Breath',
      cost: [G],
      damage: 0,
      text: 'Discard 6 Basic [G] Energy from your hand in order to Knock Out your opponent\'s Active Pokémon. If you can\'t discard 6 Basic [G] Energy in this way, this attack does nothing.'
    },
    {
      name: 'Whip Smash',
      cost: [G, C, C],
      damage: 140,
      text: ''
    }
  ];

  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Hydrapple';
  public fullName: string = 'Hydrapple DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hydra Breath
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let grassEnergies = 0;
      player.hand.cards.forEach(card => {
        if (card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Grass Energy') {
          grassEnergies++;
        }
      });
      if (grassEnergies < 6) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { allowCancel: false, min: 6, max: 6 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        player.hand.moveCardsTo(cards, player.discard);

        const dealDamage = new KnockOutOpponentEffect(effect, 999);
        dealDamage.target = effect.opponent.active;
        store.reduceEffect(state, dealDamage);
      });
    }

    return state;
  }
}