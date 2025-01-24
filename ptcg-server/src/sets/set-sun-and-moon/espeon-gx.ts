import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DamageMap, GameError } from '../../game';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PutDamagePrompt } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect } from '../../game/store/effects/game-effects';

// SUM Espeon-GX 61 (https://limitlesstcg.com/cards/SUM/61)
export class EspeonGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 200;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Psybeam',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    },
    {
      name: 'Psychic',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: 'This attack does 30 more damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
    },
    {
      name: 'Divide-GX',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Put 10 damage counters on your opponent\'s Pokémon in any way you like. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'SUM';

  public setNumber = '61';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Espeon-GX';

  public fullName: string = 'Espeon-GX SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psybeam
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      return store.reduceEffect(state, specialCondition);
    }

    // Psychic
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage += opponentEnergyCount * 30;
    }

    // Divide-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      const maxAllowedDamage: DamageMap[] = [];
      let damageLeft = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      const damage = Math.min(100, damageLeft);

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        damage,
        maxAllowedDamage,
        { allowCancel: false }
      ), targets => {
        const results = targets || [];
        for (const result of results) {
          const target = StateUtils.getTarget(state, player, result.target);
          const putCountersEffect = new PutCountersEffect(effect, result.damage);
          putCountersEffect.target = target;
          store.reduceEffect(state, putCountersEffect);
        }
      });
    }

    return state;
  }
}