import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage,
  ChooseAttackPrompt, Attack, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

function* useCrossFusionStrike(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  const discardPokemon = player.discard.cards
    .filter(card => card.superType === SuperType.POKEMON) as PokemonCard[];

  const fusionStrike = discardPokemon.filter(card => card.tags.includes(CardTag.FUSION_STRIKE));


  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    discardPokemon && fusionStrike,
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

export class RegidragoVSTAR extends PokemonCard {

  public tags = [ CardTag.POKEMON_VSTAR ];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  //   public evolvesFrom = 'Regidrago V';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 280;

  public weakness = [ ];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Apex Dragon',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Choose an attack from a [N] Pokémon in your discard pile and use it as this attack.'
  }];

  public set: string = 'FST';

  public set2: string = 'fusionstrike';

  public setNumber: string = '114';

  public name: string = 'Regidrago VSTAR';

  public fullName: string = 'Regidrago VSTAR FST 114';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useCrossFusionStrike(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
  
    return state;
  }
  
}