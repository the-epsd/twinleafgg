import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Attack } from '../../game/store/card/pokemon-types';
import { ChooseAttackPrompt, GameLog, GameMessage, StateUtils } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

function* useMakeBelieveCopycat(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const activePokemonCard = opponent.active.getPokemonCard();


  const benchPokemonCards = opponent.bench.map(b => b.getPokemonCard()).filter((card): card is PokemonCard => card !== undefined);

  const allPokemon = [activePokemonCard, ...benchPokemonCards].filter((card): card is PokemonCard => card !== undefined);

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    opponent.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    allPokemon,
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

export class MimeJr extends PokemonCard {
  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 30;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public attacks = [{
    name: 'Mimed Games',
    cost: [],
    damage: 0,
    text: 'Your opponent chooses 1 of their Pokémon\'s attacks. Use that attack as this attack.'
  }];

  public set: string = 'PAF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public name: string = 'Mime Jr.';

  public fullName: string = 'Mime Jr. PAF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useMakeBelieveCopycat(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
