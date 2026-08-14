import { CardTag, CardType, GameError, GameMessage, PokemonCard, Stage, State, StoreLike } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, TERA_RULE } from "../../../game/store/prefabs/prefabs";
import { PREVENT_DAMAGE } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Terapagosex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public cardType: CardType = C;
  public hp: number = 230;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Unified Beatdown',
    cost: [C, C],
    damage: 30,
    damageCalculation: 'x',
    text: "If you go second, you can't use this attack during your first turn. This attack does 30 damage for each of your Benched Pokémon.",
  },
  {
    name: 'Crown Opal',
    cost: [G, W, L],
    damage: 180,
    text: "During your opponent's next turn, prevent all damage done to this Pokémon by attacks from Basic non-[C] Pokémon.",
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '128';
  public name: string = 'Terapagos ex';
  public fullName: string = 'Terapagos ex SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Unified Beatdown
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      if (state.turn <= 2) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
      effect.damage = playerBench * 30;
    }
    // Crown Opal
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PREVENT_DAMAGE(store, state, effect, this, {
        sourceStage: Stage.BASIC,
        sourceCardTypes: [
          CardType.GRASS,
          CardType.FIRE,
          CardType.WATER,
          CardType.LIGHTNING,
          CardType.PSYCHIC,
          CardType.FIGHTING,
          CardType.DARK,
          CardType.METAL,
          CardType.FAIRY,
          CardType.DRAGON,
        ],
      });
    }

    TERA_RULE(effect, state, this);

    return state;
  }
}
