import { Attack, ChooseAttackPrompt, CoinFlipPrompt, GameLog, GameMessage, PokemonCard, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useMetronome(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const pokemonCard = opponent.active.getPokemonCard();
  
  if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
    return state;
  }
  
  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    [ pokemonCard ],
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

export class Clefairy extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;

  public regulationMark = 'D';
  
  public cardType: CardType = CardType.PSYCHIC;
  
  public weakness = [{ type: CardType.METAL }];

  public hp: number = 60;
  
  public retreat = [ CardType.COLORLESS ];
  
  public attacks = [
    {
      name: 'Pound',
      cost: [ CardType.PSYCHIC ],
      damage: 10,
      text: ''
    },
    {
      name: 'Mini-Metronome',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 0,
      text: 'Flip a coin. If heads, choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.'
    }
  ];
  
  public set: string = 'VIV';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '63';
  
  public name: string = 'Clefairy';
  
  public fullName: string = 'Clefairy VIV';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const generator = useMetronome(() => generator.next(), store, state, effect);
          return generator.next().value;
        }
      });
    }

    return state;
  }

}