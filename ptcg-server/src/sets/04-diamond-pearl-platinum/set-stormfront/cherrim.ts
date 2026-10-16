import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, GamePhase, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Cherrim extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cherubi';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Sunny Day',
    powerType: PowerType.POKEBODY,
    text: 'Each of your Grass Pokémon\'s and Fire Pokémon\'s attacks does 10 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Salty-sweet Pollen',
    cost: [],
    damage: 20,
    text: 'Remove 2 damage counters from 1 of your Pokémon.'
  },
  {
    name: 'Solarbeam',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Cherrim';
  public fullName: string = 'Cherrim SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sunny Day
    if (effect instanceof DealDamageEffect && state.phase === GamePhase.ATTACK) {
      const attackerOwner = effect.player;
      const opponent = StateUtils.getOpponent(state, attackerOwner);
      if (effect.target !== opponent.active || effect.damage <= 0) {
        return state;
      }
      const sourceCard = effect.source.getPokemonCard();
      if (!sourceCard) {
        return state;
      }
      const isGrassOrFire = sourceCard.cardType.includes(CardType.GRASS)
        || sourceCard.cardType.includes(CardType.FIRE);
      if (!isGrassOrFire || !StateUtils.isPokemonInPlay(attackerOwner, this)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, attackerOwner, this)) {
        return state;
      }
      effect.damage += 10;
    }

    // Salty-sweet Pollen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const blocked: CardTarget[] = [];
      let hasPokemonWithDamage = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
        if (cardList.damage === 0) {
          blocked.push(target);
        } else {
          hasPokemonWithDamage = true;
        }
      });
      if (!hasPokemonWithDamage) {
        return state;
      }
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), results => {
        const targets = results || [];
        targets.forEach(target => {
          const healEffect = new HealEffect(player, target, 20);
          store.reduceEffect(state, healEffect);
        });
      });
    }

    return state;
  }
}
