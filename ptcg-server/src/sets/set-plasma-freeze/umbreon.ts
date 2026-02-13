import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Umbreon extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Dark Shade',
    powerType: PowerType.ABILITY,
    text: 'Each of your Team Plasma Pokémon in play gets +20 HP.'
  }];

  public attacks = [
    {
      name: 'Darkness Fang',
      cost: [D, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Umbreon';
  public fullName: string = 'Umbreon PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Dark Shade (passive - HP boost)
    if (effect instanceof CheckHpEffect) {
      const targetCard = effect.target.getPokemonCard();
      if (!targetCard || !targetCard.tags.includes(CardTag.TEAM_PLASMA)) {
        return state;
      }

      // Find the owner of the target
      let targetOwner: any = null;
      state.players.forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList === effect.target) {
            targetOwner = p;
          }
        });
      });

      if (!targetOwner) {
        return state;
      }

      // Check if this Umbreon is on the same player's side
      let umbrelonInPlay = false;
      targetOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: any, card: any) => {
        if (card === this) {
          umbrelonInPlay = true;
        }
      });

      if (!umbrelonInPlay) {
        return state;
      }

      // Check ability lock
      try {
        const stub = new PowerEffect(targetOwner, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      effect.hp += 20;
    }

    return state;
  }
}
