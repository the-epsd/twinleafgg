import { Attack, Card, ChooseAttackPrompt, GameLog, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

function* useGeneticMemory(next: Function, store: StoreLike, state: State,
  self: Kingdraex, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Gather all Pokémon cards from the evolution chain (previous evolutions)
  const evolutionCards: Card[] = [];
  for (const card of player.active.cards) {
    if (card.superType === SuperType.POKEMON && card !== self) {
      evolutionCards.push(card);
    }
  }

  // If there are no previous evolutions with attacks, can't use this attack
  if (evolutionCards.length === 0 || !evolutionCards.some(c => c.attacks && c.attacks.length > 0)) {
    return state;
  }

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    evolutionCards,
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  const attack: Attack | null = selected;

  if (attack === null) {
    return state;
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: attack.name
  });

  const attackEffect = new AttackEffect(player, opponent, attack);
  state = store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  return state;
}

export class Kingdraex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Seadra';
  public cardType: CardType = W;
  public hp: number = 150;
  public weakness = [{ type: G }, { type: L }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Genetic Memory',
    cost: [W],
    damage: 0,
    text: 'Use any attack from Kingdra ex\'s Basic Pokémon card or Stage 1 Evolution card. (Kingdra ex doesn\'t have to pay for that attack\'s Energy cost.)'
  },
  {
    name: 'Hydrocannon',
    cost: [C, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Does 50 damage plus 20 more damage for each [W] Energy attached to Kingdra ex but not used to pay for this attack\'s Energy cost. You can\'t add more than 40 damage in this way.'
  }];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Kingdra ex';
  public fullName: string = 'Kingdra ex DR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useGeneticMemory(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check attack cost
      const checkCost = new CheckAttackCostEffect(player, this.attacks[1]);
      state = store.reduceEffect(state, checkCost);

      // Check attached energy
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      // Filter for only Water Energy
      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER));

      // Get number of extra Water energy  
      const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;

      // Apply damage boost based on extra Water energy
      effect.damage += Math.min(extraWaterEnergy, 4) * 20;
    }

    return state;
  }
}