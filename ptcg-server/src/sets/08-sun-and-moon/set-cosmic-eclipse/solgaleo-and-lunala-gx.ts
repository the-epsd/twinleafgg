import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlaySupporterEffect } from '../../../game/store/effects/play-card-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE_AND_EFFECTS_TO_ALL_YOUR_POKEMON } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class SolgaleoLunalaGX extends PokemonCard {
  protected _tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 270;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Cosmic Burn',
    cost: [P, P, P, C],
    damage: 230,
    text: 'This Pokémon can\'t use Cosmic Burn during your next turn.'
  },
  {
    name: 'Light of the Protector-GX',
    cost: [P, P, C],
    damage: 200,
    gxAttack: true,
    text: 'If you played Lillie\'s Full Force from your hand during this turn, prevent all effects of attacks, including damage, done to each of your Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'CEC';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Solgaleo & Lunala-GX';
  public fullName: string = 'Solgaleo & Lunala-GX CEC';

  public readonly PLAYED_LILLIES_FULL_FORCE_MARKER = 'PLAYED_LILLIES_FULL_FORCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cosmic Burn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Cosmic Burn')) {
        player.active.cannotUseAttacksNextTurnPending.push('Cosmic Burn');
      }
    }

    if (effect instanceof PlaySupporterEffect) {
      if (effect.trainerCard.name === 'Lillie\'s Full Force') {
        effect.player.marker.addMarker(this.PLAYED_LILLIES_FULL_FORCE_MARKER, this);
      }
    }

    // Light of the Protector-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      if (player.marker.hasMarker(this.PLAYED_LILLIES_FULL_FORCE_MARKER, this)) {
        return PREVENT_DAMAGE_AND_EFFECTS_TO_ALL_YOUR_POKEMON(store, state, effect, this);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PLAYED_LILLIES_FULL_FORCE_MARKER, this);
    }

    return state;
  }
}
