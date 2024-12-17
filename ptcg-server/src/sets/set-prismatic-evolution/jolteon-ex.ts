import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType, StateUtils, GameError } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardEnergyPrompt } from '../../game/store/prompts/discard-energy-prompt';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class Jolteonex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = L;

  public hp: number = 260;

  public weakness = [{ type: F }];

  public retreat = [];

  public attacks = [
    {
      name: 'Flash Spear',
      cost: [L, C],
      damage: 60,
      damageCalculation: '+',
      text: 'You may discard up to 2 Basic Energy from your Benched Pokémon. This attack does 90 more damage for each card discarded this way.'
    },
    {
      name: 'Dravite',
      cost: [R, W, L],
      damage: 280,
      text: 'This Pokémon can\'t attack during your next turn'
    },
  ];

  public regulationMark = 'H';

  public set: string = 'SV8a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '52';

  public name: string = 'Jolteon ex';

  public fullName: string = 'Jolteon ex SV8a';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new DiscardEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],// Card source is target Pokemon
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), transfers => {

        if (transfers === null || transfers.length === 0) {
          return state;
        }

        for (const transfer of transfers) {
          let totalDiscarded = 0;

          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = player.discard;
          source.moveCardTo(transfer.card, target);

          totalDiscarded = transfers.length;

          // Base damage is 60
          if (totalDiscarded === 0) {
            effect.damage = 60;
          } else if (totalDiscarded === 1) {
            effect.damage = 150;  // 60 + 90
          } else if (totalDiscarded === 2) {
            effect.damage = 240;  // 60 + (90 * 2)
          }

        }
        console.log('Total Damage: ' + effect.damage);
        return state;
      });
    }

    // Carnelian
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}