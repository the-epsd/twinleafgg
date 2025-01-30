import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import {StoreLike,State, StateUtils, DamageMap, PlayerType, MoveDamagePrompt, GameMessage, SlotType} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {AttackEffect} from '../../game/store/effects/game-effects';
import {CheckHpEffect, CheckProvidedEnergyEffect} from '../../game/store/effects/check-effects';
import {AddSpecialConditionsEffect} from '../../game/store/effects/attack-effects';

export class Alakazam extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kadabra';
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Strange Hacking',
      cost: [ P ],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Confused. You may move any number of damage counters from your opponent\'s Pokémon to their other Pokémon in any way you like.'
    },
    {
      name: 'Psychic',
      cost: [ P ],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 50 more damage for each Energy attached to your opponent\'s Active Pokémon.'
    },
  ];

  public set: string = 'TWM';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Alakazam';
  public fullName: string = 'Alakazam TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Strange Hacking
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialCondition);
    
      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });
    
      return store.prompt(state, new MoveDamagePrompt(
        effect.player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        maxAllowedDamage,
        { allowCancel: true }
      ), transfers => {
        if (transfers === null) {
          return;
        }
    
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          if (source.damage >= 10) {
            source.damage -= 10;
            target.damage += 10;
          }
        }
      });
    }

    // Psychic
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += opponentEnergyCount * 50;
    }

    return state;
  }

}