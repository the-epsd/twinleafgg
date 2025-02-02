import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DamageMap, GameMessage, PlayerType, PutDamagePrompt, SlotType, StateUtils } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

function* useAngryGrudge(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
    
  const hasBenched = opponent.bench.some(b => b.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    maxAllowedDamage.push({ target, damage: 120 });
  });

  const damage = 10;

  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.ACTIVE ],
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

      effect.damage = results.length * 20;
    }

  });
}

export class Annihilapeex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Primape';

  public regulationMark = 'G';

  public tags = [ CardTag.POKEMON_ex ];

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 320;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Angry Grudge',
      cost: [ ],
      damage: 0,
      text: 'Put up to 12 damage counters on this Pokémon. This attack does 20 damage for each damage counter you placed in this way.'
    },
    {
      name: 'Seismic Toss',
      cost: [ CardType.FIGHTING ],
      damage: 150,
      text: ''
    }
  ];

  public set: string = 'SVP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public name: string = 'Annihilape ex';

  public fullName: string = 'Annihilape ex SVP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useAngryGrudge(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}