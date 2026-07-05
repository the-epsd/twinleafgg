import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EffectOfAbilityEffect, PowerEffect } from '../../../game/store/effects/game-effects';
import { AfterAttackEffect } from '../../../game/store/effects/game-phase-effects';

export class IronThornsex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 230;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Initialization',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'As long as this Pokémon is in the Active Spot, Pokémon with a Rule Box in play (both yours and your opponent\'s) have no Abilities, except for Future Pokémon. (Pokémon ex, Pokémon V, etc. have Rule Boxes.)'
  }];

  public attacks = [{
    name: 'Volt Cyclone',
    cost: [L, C, C],
    damage: 140,
    text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Iron Thorns ex';
  public fullName: string = 'Iron Thorns ex TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Initialization') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Iron Thorns ex is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      const ruleBoxScratch = new PokemonCardList();
      ruleBoxScratch.cards.push(effect.card);
      // Pokémon without a Rule Box — don't block ability
      if (!ruleBoxScratch.hasRuleBox()) {
        return state;
      }

      if (effect.power.useFromDiscard || effect.power.useFromHand) {
        return state;
      }

      // Try reducing ability for each player  
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // Check if we can apply the ability lock to target Pokemon
      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const canApplyAbility = new EffectOfAbilityEffect(
          player.active.getPokemonCard() === this ? player : opponent, this.powers[0], this, cardList);
        store.reduceEffect(state, canApplyAbility);
        if (!canApplyAbility.target) {
          return state;
        }
      }

      // Apply ability lock
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (effect instanceof AfterAttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      // Then prompt for energy movement
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    return state;
  }
}
