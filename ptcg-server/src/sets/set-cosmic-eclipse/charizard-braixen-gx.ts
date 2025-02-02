import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, GameError, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class CharizardBraixenGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TAG_TEAM];
  public cardType: CardType = R;
  public hp: number = 270;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Brilliant Flare',
      cost: [R, R, R, C],
      damage: 180,
      text: 'You may search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Crimson Flame Pillar-GX',
      cost: [R],
      damage: 0,
      text: 'Attach 5 basic Energy cards from your discard pile to your Pokémon in any way you like. If this Pokémon has at least 1 extra Energy attached to it (in addition to this attack\'s cost), your opponent\'s Active Pokémon is now Burned and Confused. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Charizard & Braixen-GX';
  public fullName: string = 'Charizard & Braixen-GX CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Brilliant Flare
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0])
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, 0, 3);

    // Crimson Flame Pillar-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.usedGX === true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }

      player.usedGX = true;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: 5 }
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

      // Check for the extra energy cost.
      const extraEffectCost: CardType[] = [R, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (!meetsExtraEffectCost) { return state; }  // If we don't have the extra energy, we just deal damage.

      const opponent = StateUtils.getOpponent(state, player);

      const active = opponent.active;
      active.addSpecialCondition(SpecialCondition.BURNED);
      active.addSpecialCondition(SpecialCondition.CONFUSED);
    }

    return state;
  }
}
