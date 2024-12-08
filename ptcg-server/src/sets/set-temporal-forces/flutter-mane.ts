import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { DamageMap, GameError, GameMessage, PlayerType, PutDamagePrompt, SlotType, StateUtils } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

function* useHexHurl(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const hasBenched = opponent.bench.some(b => b.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    maxAllowedDamage.push({ target, damage: card.hp + 20 });
  });

  const damage = 20;

  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [SlotType.BENCH],
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

export class FlutterMane extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public tags = [CardTag.ANCIENT];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Midnight Fluttering',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Active Pokémon has no Abilities, except for Midnight Fluttering.'
  }];

  public attacks = [{
    name: 'Hex Hurl',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'Put 2 damage counters on your opponent\'s Benched Pokémon in any way you like.'
  }];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '78';

  public name: string = 'Flutter Mane';

  public fullName: string = 'Flutter Mane TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      // Only proceed if Flutter Mane is in the Active spot
      if (owner.active.getPokemonCard() !== this) {
        return state;
      }

      const effectCardList = StateUtils.findCardList(state, effect.card);
      const effectOwner = StateUtils.findOwner(state, effectCardList);
      
      // handles evolution abilities in opponent's active
      const effectEvolvesFromOpponentsActive = 
        effectOwner !== owner && effect.card.evolvesFrom === player.active.getPokemonCard()?.name;
      
      // Only check opponent's Active Pokemon
      if (player === owner || (player.active.getPokemonCard() !== effect.card && !effectEvolvesFromOpponentsActive)) {
        return state;
      }

      // Try reducing ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        if (!effect.power.exemptFromAbilityLock) {
          return state;
        }
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useHexHurl(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
