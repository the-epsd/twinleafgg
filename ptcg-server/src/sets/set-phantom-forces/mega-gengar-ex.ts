import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, ChooseAttackPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { GameLog, GameMessage } from '../../game/game-message';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';
import {AttackEffect} from '../../game/store/effects/game-effects';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';

function* usePhantomGate(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const benched = opponent.bench.filter(b => b.cards.length > 0 && b.getPokemonCard()?.name !== 'M Gengar-EX' && opponent.active !== b);
  benched.push(opponent.active);

  // Return early if no valid targets
  if (benched.length === 0) {
    return state;
  }

  const allYourPokemon = [...benched.map(b => b.getPokemonCard())];

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    allYourPokemon.filter((card): card is any => card !== undefined),
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  // Validate selected attack
  if (!selected || selected.copycatAttack) {
    return state; // Exit if no valid attack is selected
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: selected.name
  });

  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, selected);
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

export class MGengarEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX, CardTag.MEGA ];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Gengar-EX';
  public cardType: CardType = P;
  public hp: number = 220;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [ C ];

  public powers = [{
    name: 'Mega Evolution Rule',
    powerType: PowerType.MEGA_EVOLUTION_RULE,
    text: 'When 1 of your Pokémon becomes a Mega Evolution Pokémon, your turn ends.'
  }];

  public attacks = [
    {
      name: 'Phantom Gate',
      cost: [ P, C, C ],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Pokémon\'s attacks and use it as this attack.'
    }
  ];

  public set: string = 'PHF';
  public name: string = 'M Gengar-EX';
  public fullName: string = 'M Gengar-EX PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // love me some funny evolution crap
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this){
      if (effect.target.tool && effect.target.tool.name === 'Gengar Spirit Link'){
        return state;
      }

      const endTurnEffect = new EndTurnEffect(effect.player);
      store.reduceEffect(state, endTurnEffect);
    }

    // Phantom Gate
    if (WAS_ATTACK_USED(effect, 0, this)){
      const generator = usePhantomGate(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
