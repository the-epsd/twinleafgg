import { CardType, DamageMap, GameMessage, MoveDamagePrompt, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike } from "../../game";
import { CheckHpEffect } from "../../game/store/effects/check-effects";
import { Effect } from "../../game/store/effects/effect";
import { PowerEffect } from "../../game/store/effects/game-effects";
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from "../../game/store/prefabs/attack-effects";
import { WAS_POWER_USED, BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "../../game/store/prefabs/prefabs";

function* useDamageSwap(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  const maxAllowedDamage: DamageMap[] = [];
  player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    const checkHpEffect = new CheckHpEffect(player, cardList);
    store.reduceEffect(state, checkHpEffect);
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
  });

  return store.prompt(state, new MoveDamagePrompt(
    effect.player.id,
    GameMessage.MOVE_DAMAGE,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    maxAllowedDamage,
    { allowCancel: true }
  ), transfers => {
    if (transfers === null) {
      return;
    }

    for (const transfer of transfers) {
      const source = StateUtils.getTarget(state, player, transfer.from);
      const target = StateUtils.getTarget(state, player, transfer.to);

      if (source.damage >= 10) {
        source.damage -= 10;
        target.damage += 10;
      }
    }
  });
}

export class Slowbro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Slowpoke';
  public hp: number = 60;
  public cardType: CardType = P;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Strange Behavior',
    powerType: PowerType.POKEMON_POWER,
    text: 'As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to Slowbro as long as you don\'t Knock Out Slowbro. This power can\'t be used if Slowbro is Asleep, Confused, or Paralyzed.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Psyshock',
    cost: [P, P],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Slowbro';
  public fullName: string = 'Slowbro FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Strange Behavior
    if (WAS_POWER_USED(effect, 0, this)) {
      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(effect.player, this);
      const generator = useDamageSwap(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    // Psyshock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
