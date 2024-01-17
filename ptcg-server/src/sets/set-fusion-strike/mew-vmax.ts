import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage,
  ChooseAttackPrompt, Attack, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ApplyWeaknessEffect, AfterDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';

function* useCrossFusionStrike(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  const benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
  const fusionStrike = benchPokemon.filter(card => card.tags.includes(CardTag.FUSION_STRIKE));


  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    benchPokemon && fusionStrike,
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
  
  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, attack);
  store.reduceEffect(state, attackEffect);
  
  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }
  
  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }
  
  return state;
}

export class MewVMAX extends PokemonCard {

  public tags = [ CardTag.POKEMON_VMAX, CardTag.FUSION_STRIKE ];

  public regulationMark = 'E';

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Mew V';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 310;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [ ];

  public attacks = [{
    name: 'Cross Fusion Strike',
    cost: [ CardType.COLORLESS, CardType.COLORLESS ],
    damage: 0,
    text: 'This Pokemon can use the attacks of any Pokemon in play ' +
      '(both yours and your opponent\'s). (You still need the necessary ' +
      'Energy to use each attack.)'
  },
  {
    name: 'Max Miracle',
    cost: [ CardType.PSYCHIC, CardType.PSYCHIC ],
    damage: 130,
    text: 'This attack\'s damage isn\'t affected by any effects on your ' +
        'Opponent\'s Active Pokémon.'
  }
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '114';

  public name: string = 'Mew VMAX';

  public fullName: string = 'Mew VMAX FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      const applyWeakness = new ApplyWeaknessEffect(effect, 130);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;
  
      effect.damage = 0;
  
      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }
    

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useCrossFusionStrike(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
  
    return state;
  }
  
}