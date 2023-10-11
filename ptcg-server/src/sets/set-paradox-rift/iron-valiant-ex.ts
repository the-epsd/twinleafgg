import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, GameError, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class IronValiantex extends PokemonCard {

  public tags = [ CardTag.POKEMON_ex, CardTag.FUTURE ];

  public regulationMark = 'G';
  
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 220;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [
    {
      name: 'Tachyon Bits',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
    }
  ];

  public attacks = [
    {
      name: 'Laser Blade',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 200,
      text: 'During your next turn, this Pokémon can’t attack.'
    }
  ];

  public set: string = 'PAR';

  public set2: string = 'futureflash';
  
  public setNumber: string = '38';

  public name: string = 'Iron Valiant ex';

  public fullName: string = 'Iron Valiant ex PAR';

  public readonly TACHYON_BITS_MARKER = 'TACHYON_BITS_MARKER';
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }
  
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false;
      console.log('movedToActiveThisTurn = false');
      effect.player.marker.removeMarker(this.TACHYON_BITS_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (!this.movedToActiveThisTurn) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);

      }
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { max: 1, allowCancel: true },
      ), selected => {
        if (!selected || selected.length === 0) {
          return state;
        }
        effect.player.marker.addMarker(this.TACHYON_BITS_MARKER, this);
        const target = selected[0];
        target.damage += 20;
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }
    return state;
  }
}
