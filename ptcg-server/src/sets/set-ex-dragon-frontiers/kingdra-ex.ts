import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, HAS_MARKER, IS_POKEBODY_BLOCKED, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Kingdraex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Seadra';
  public tags = [CardTag.POKEMON_ex, CardTag.DELTA_SPECIES];
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Extra Smoke',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to your Stage 2 Pokémon-ex by your opponent\'s attacks is reduced by 10 (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Energy Link',
    cost: [F, C],
    damage: 40,
    text: 'Search your discard pile for an Energy card and attach it to Kingdra ex.'
  },
  {
    name: 'Protective Swirl',
    cost: [F, C, C],
    damage: 80,
    text: 'Kingdra ex has no Weakness during your opponent\'s next turn.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Kingdra ex';
  public fullName: string = 'Kingdra ex DF';

  public readonly PROTECTIVE_MARKER = 'PROTECTIVE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isKingdraInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isKingdraInPlay = true;
        }
      });

      if (!isKingdraInPlay) {
        return state;
      }

      const target = effect.target.getPokemonCard();
      if (target?.stage === Stage.STAGE_2 && target?.tags.includes(CardTag.POKEMON_ex)) {
        effect.damage -= 10;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (!player.discard.cards.some(card => card.superType === SuperType.ENERGY)) {
        return state;
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      ADD_MARKER(this.PROTECTIVE_MARKER, effect.player.active, this);
    }

    if (effect instanceof CheckPokemonStatsEffect && HAS_MARKER(this.PROTECTIVE_MARKER, effect.target, this)) {
      if (effect.target.getPokemonCard() === this) {
        effect.weakness = [];
      }
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemon => {
        if (HAS_MARKER(this.PROTECTIVE_MARKER, pokemon, this)) {
          REMOVE_MARKER(this.PROTECTIVE_MARKER, pokemon, this);
        }
      });
    }

    return state;
  }
}