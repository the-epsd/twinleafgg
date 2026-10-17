import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, IS_POKEPOWER_BLOCKED, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Ninetales extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Vulpix';
  public hp: number = 80;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Color Shift',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may choose 1 of your opponent\'s Pokémon. Ninetales is the same type as that Pokémon (all if that Pokémon is more than 1 type) until the end of your turn. This power can\'t be used if Ninetales is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Fire Blast',
    cost: [R, R],
    damage: 60,
    text: 'Discard a Fire Energy attached to Ninetales.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Ninetales';
  public fullName: string = 'Ninetales MT';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public readonly COLOR_SHIFT_MARKER = 'COLOR_SHIFT_MARKER';
  private shiftedTypes: CardType[] | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.COLOR_SHIFT_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.COLOR_SHIFT_MARKER, effect.player, this);
      this.shiftedTypes = undefined;
    }

    // Color Shift type override
    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
      if (this.shiftedTypes && this.shiftedTypes.length > 0) {
        effect.cardTypes = [...this.shiftedTypes];
      }
      return state;
    }

    // Color Shift
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        if (!selected || selected.length === 0) {
          return;
        }
        const targetCard = selected[0].getPokemonCard();
        if (!targetCard) {
          return;
        }

        const typeCheck = new CheckPokemonTypeEffect(selected[0]);
        store.reduceEffect(state, typeCheck);
        this.shiftedTypes = [...typeCheck.cardTypes];
        ADD_MARKER(this.COLOR_SHIFT_MARKER, player, this);
      });
    }

    // Fire Blast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
    }

    return state;
  }
}
