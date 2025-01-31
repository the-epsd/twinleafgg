import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, PlayerType, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';

export class ManaphyEX extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [ C ];

  public powers = [{
    name: 'Aqua Tube',
    powerType: PowerType.ABILITY,
    text: 'Each of your Pokémon that has any [W] Energy attached to it has no Retreat Cost.'
  }];
  public attacks = [
    {
      name: 'Mineral Pump',
      cost: [ W, W ],
      damage: 60,
      text: 'Heal 30 damage from each of your Benched Pokémon.'
    }
  ];

  public set: string = 'BKP';
  public setNumber: string = '32';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Manaphy EX';
  public fullName: string = 'Manaphy EX BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aqua Tube
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;

      let isManaphyOnYourSide = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this){
          isManaphyOnYourSide = true;
        }
      });

      if (!isManaphyOnYourSide){
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      player.active.cards.forEach(card => {
        if (card instanceof EnergyCard && card.name === 'Water Energy'){
          effect.cost = [ ];
        }
      });
    }

    // Mineral Pump
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === player.active){
          return;
        }
        const healing = new HealTargetEffect(effect, 30);
        healing.target = cardList;
        store.reduceEffect(state, healing);
      });
    }

    return state;
  }
} 