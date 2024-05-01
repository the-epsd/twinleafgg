import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { DamageMap, GameError, GameMessage, PlayerType, PokemonCardList, PutDamagePrompt, SlotType, StateUtils } from '../../game';
import { CheckHpEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

function* useLostMine(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
    
  const hasBenched = opponent.bench.some(b => b.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  const maxAllowedDamage: DamageMap[] = [];
  let damageLeft = 0;
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    const checkHpEffect = new CheckHpEffect(opponent, cardList);
    store.reduceEffect(state, checkHpEffect);
    damageLeft += checkHpEffect.hp - cardList.damage;
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
  });
    
  const damage = Math.min(20, damageLeft);

  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [ SlotType.BENCH ],
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

  public tags = [ CardTag.ANCIENT ];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Witching Hour Flutter',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Active Pokémon has no Abilities, except for Witching Hour Flutter.'
  }];

  public attacks = [{
    name: 'Flying Curse',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 90,
    text: 'Put 2 damage counters on your opponent\'s Benched Pokémon in any way you like.'
  }];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Flutter Mane';

  public fullName: string = 'Flutter Mane TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Flutter Mane is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      const pokemon = opponent.active.getPokemonCard();
      if (pokemon && pokemon.powers && pokemon.powers.length > 0) {
        const pokemonCardList = new PokemonCardList();
        const checkPokemonType = new CheckPokemonTypeEffect(pokemonCardList);
        store.reduceEffect(state, checkPokemonType);
      }


      // Try reducing ability for opponent
      try {
        const playerPowerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, playerPowerEffect);
      } catch {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useLostMine(() => generator.next(), store, state, effect);
      return generator.next().value;
    }


    return state;
  }
}