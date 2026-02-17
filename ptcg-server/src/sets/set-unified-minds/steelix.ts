import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PlayerType, SlotType, StoreLike, State, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, ATTACH_ENERGY_PROMPT, REMOVE_MARKER_AT_END_OF_TURN, REPLACE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public cardType: CardType = F;
  public hp: number = 170;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public readonly GIGATON_SHAKE_MARKER = 'STEELIX_UNM_GIGATON_SHAKE_MARKER';
  public readonly CLEAR_GIGATON_SHAKE_MARKER = 'STEELIX_UNM_CLEAR_GIGATON_SHAKE_MARKER';

  public attacks = [
    {
      name: 'Ground Stream',
      cost: [F],
      damage: 20,
      text: 'Attach 2 [F] Energy cards from your discard pile to this Pokémon.'
    },
    {
      name: 'Gigaton Shake',
      cost: [F, C, C, C, C],
      damage: 220,
      text: 'During your next turn, your Pokémon can\'t attack. (This includes Pokémon that come into play on that turn.)'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '104';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Ground Stream
    // Ref: set-unbroken-bonds/kyurem.ts (Call Forth Cold - attach energy from discard)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      state = ATTACH_ENERGY_PROMPT(
        store,
        state,
        player,
        PlayerType.BOTTOM_PLAYER,
        SlotType.DISCARD,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fighting Energy' },
        { min: 0, max: 2, allowCancel: true }
      );
    }

    // Attack 2: Gigaton Shake
    // Ref: set-unbroken-bonds/rhyperior.ts (Hefty Cannon - can't attack marker pattern)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.marker.addMarker(this.GIGATON_SHAKE_MARKER, this);
    }

    // Block all attacks from this player while marker is active (check both phases)
    if (effect instanceof AttackEffect
      && (effect.player.marker.hasMarker(this.GIGATON_SHAKE_MARKER, this)
        || effect.player.marker.hasMarker(this.CLEAR_GIGATON_SHAKE_MARKER, this))) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // 2-phase marker: persists through opponent's turn, blocks during player's next turn
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.CLEAR_GIGATON_SHAKE_MARKER, this);
    REPLACE_MARKER_AT_END_OF_TURN(effect, this.GIGATON_SHAKE_MARKER, this.CLEAR_GIGATON_SHAKE_MARKER, this);

    return state;
  }
}
