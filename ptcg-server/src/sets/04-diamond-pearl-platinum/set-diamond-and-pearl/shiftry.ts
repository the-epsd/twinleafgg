import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, DEVOLVE_POKEMON, HAS_MARKER, IS_POKEPOWER_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Shiftry extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nuzleaf';
  public hp: number = 120;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: 30 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Darkness Fan',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Shiftry is your Active Pokémon, you may flip a coin. If heads, choose 1 Evolved Pokémon on your opponent\'s Bench, remove the highest Stage Evolution card from that Pokémon, and put it back into his or her hand. This power can\'t be used if Shiftry is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Spirit Dance',
    cost: [D, D, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Flip 2 coins. This attack does 50 damage plus 20 more damage for each heads.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Shiftry';
  public fullName: string = 'Shiftry DP';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // Darkness Fan
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const hasEvolvedBenched = opponent.bench.some(b => b.getPokemons().length > 1);
      if (!hasEvolvedBenched) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        const blocked: CardTarget[] = [];
        opponent.bench.forEach((b, index) => {
          if (b.getPokemons().length <= 1) {
            blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
          }
        });

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false, min: 1, max: 1, blocked }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          DEVOLVE_POKEMON(store, state, targets[0], opponent.hand);
        });
      });

      return state;
    }

    // Spirit Dance
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        effect.damage += 20 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
