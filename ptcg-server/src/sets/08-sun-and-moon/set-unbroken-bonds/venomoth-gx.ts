import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import {
  WAS_ATTACK_USED,
  BLOCK_IF_GX_ATTACK_USED,
  DRAW_CARDS,
  SHUFFLE_DECK,
  ADD_MARKER,
  HAS_MARKER,
  REMOVE_MARKER,
  PREVENT_DAMAGE,
} from '../../../game/store/prefabs/prefabs';

export class VenomothGx extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Venonat';
  public cardType: CardType = G;
  public hp: number = 200;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Shinobi Mastery',
    cost: [G, C, C],
    damage: 110,
    damageCalculation: '+',
    text: 'If you played Koga\'s Trap from your hand during this turn, this attack does 90 more damage. If you played Janine from your hand during this turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Ten-Card Return-GX',
    cost: [C],
    damage: 60,
    text: 'Shuffle your hand into your deck. Then, draw 10 cards. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'UNB';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Venomoth-GX';
  public fullName: string = 'Venomoth-GX UNB';

  public readonly KOGAS_TRAP_MARKER = 'VENOMOTH_GX_KOGAS_TRAP_MARKER';
  public readonly JANINE_MARKER = 'VENOMOTH_GX_JANINE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Track if Koga's Trap or Janine was played this turn
    if (effect instanceof TrainerEffect && effect.trainerCard.name === 'Koga\'s Trap') {
      ADD_MARKER(this.KOGAS_TRAP_MARKER, effect.player, this);
    }

    if (effect instanceof TrainerEffect && effect.trainerCard.name === 'Janine') {
      ADD_MARKER(this.JANINE_MARKER, effect.player, this);
    }

    if (effect instanceof EndTurnEffect) {
      if (HAS_MARKER(this.KOGAS_TRAP_MARKER, effect.player, this)) {
        REMOVE_MARKER(this.KOGAS_TRAP_MARKER, effect.player, this);
      }
      if (HAS_MARKER(this.JANINE_MARKER, effect.player, this)) {
        REMOVE_MARKER(this.JANINE_MARKER, effect.player, this);
      }
    }

    // Shinobi Mastery
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.KOGAS_TRAP_MARKER, player, this)) {
        effect.damage += 90;
      }

      if (HAS_MARKER(this.JANINE_MARKER, player, this)) {
        PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
      }
    }

    // Ten-Card Return-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const cards = player.hand.cards.slice();
      cards.forEach(c => {
        player.hand.moveCardTo(c, player.deck);
      });
      SHUFFLE_DECK(store, state, player);

      DRAW_CARDS(store, state, player, 10);
    }

    return state;
  }
}
