import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronThornsex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Initialization',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'As long as this Pokémon is in the Active Spot, Pokémon with a Rule Box in play ' +
      '(both yours and your opponent\'s) have no Abilities, except for Future Pokémon. ' +
      '(Pokémon ex, Pokémon V, etc. have Rule Boxes.) '
  }];

  public attacks = [
    {
      name: 'Volt Cyclone',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 140,
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name: string = 'Iron Thorns ex';

  public fullName: string = 'Iron Thorns ex TWM';

  private readonly BOLT_CYCLONE_MARKER = 'BOLT_CYCLONE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Initialization') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const ruleBoxTags = [
        CardTag.POKEMON_ex,
        CardTag.POKEMON_V,
        CardTag.POKEMON_VSTAR,
        CardTag.POKEMON_VMAX,
        CardTag.RADIANT
      ];

      // Iron Thorns ex is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // Pokemon isn't a rule box - don't bother checking to block ability
      if (!ruleBoxTags.some(tag => effect.card.tags.includes(tag))) {
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

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.BOLT_CYCLONE_MARKER, effect.player, this);
      return state;
    }

    if (effect instanceof AfterAttackEffect && HAS_MARKER(this.BOLT_CYCLONE_MARKER, effect.player, this)) {
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

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BOLT_CYCLONE_MARKER, this);

    return state;
  }
}
