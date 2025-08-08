import { CardTag, CardType, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { ADD_MARKER, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, HAS_MARKER, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, REMOVE_MARKER_AT_END_OF_TURN, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Umbreonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Darker Ring',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you play Umbreon ex from your hand to evolve 1 of your Pokémon, switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
  }];

  public attacks = [{
    name: 'Black Cry',
    cost: [C],
    damage: 20,
    text: 'The Defending Pokémon can\'t retreat or use any Poké-Powers during your opponent\'s next turn.'
  },
  {
    name: 'Darkness Fang',
    cost: [D, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'UF';
  public setNumber: string = '112';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Umbreon ex';
  public fullName: string = 'Umbreon ex UF';

  public readonly BLACK_CRY_MARKER = 'BLACK_CRY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Darker Ring
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];

        if (cardList) {
          opponent.switchPokemon(cardList);
        }
      });
    }

    // Black Cry
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      ADD_MARKER(this.BLACK_CRY_MARKER, opponent.active, this);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BLACK_CRY_MARKER, this);

    // Black Cry Power
    if (effect instanceof PowerEffect && HAS_MARKER(this.BLACK_CRY_MARKER, effect.player.active, this) && effect.power.powerType === PowerType.POKEPOWER) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }

    return state;
  }
}