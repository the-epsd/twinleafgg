import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EnergyCard, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';

export class Registeelex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 230;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Regicharge',
    cost: [C],
    damage: 0,
    text: 'Attach up to 2 Basic [M] Energy from your discard pile to this Pokemon.'
  },
  {
    name: 'Protect Steel',
    cost: [M, C, C, C],
    damage: 140,
    text: 'During your opponent\'s next turn, this Pokemon takes 50 less damage from attacks.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Registeel ex';
  public fullName: string = 'Registeel ex M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Regicharge attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides && c.provides.includes(CardType.METAL);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Metal Energy' },
        { allowCancel: false, min: 1, max: 2 }
      ), transfers => {
        transfers = transfers || [];
        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });

      return state;
    }

    // Protect Steel attack - reduce damage next turn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.damageReductionNextTurn = 50;
    }

    return state;
  }
}


