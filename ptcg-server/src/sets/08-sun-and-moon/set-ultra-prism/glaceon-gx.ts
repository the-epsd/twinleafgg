import {
  CardTag,
  CardType,
  ChoosePokemonPrompt,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import {
  HANDLE_ABILITY_LOCK,
  IS_ABILITY_LOCKER_ACTIVE,
  LOCKER_ABILITY_APPLIES,
} from '../../../game/store/prefabs/ability-lock';
import { WAS_ATTACK_USED, BLOCK_IF_GX_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class GlaceonGX extends PokemonCard {
  protected _tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType[] = [W];
  public hp: number = 200;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Freezing Gaze',
      useWhenInPlay: false,
      powerType: PowerType.ABILITY,
      abilityLock: true,
      text: "As long as this Pokémon is your Active Pokémon, your opponent's Pokémon-GX and Pokémon-EX in play, in their hand, and in their discard pile have no Abilities, except for Freezing Gaze.",
    },
  ];

  public attacks = [
    {
      name: 'Frost Spear',
      cost: [W, C, C],
      damage: 90,
      text: "This attack does 30 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
    },
    {
      name: 'Polar Spear-GX',
      cost: [W, C, C],
      damage: 50,
      text: "This attack does 50 damage for each damage counter on your opponent's Active Pokémon. (You can't use more than 1 GX attack in a game.)",
    },
  ];

  public set: string = 'UPR';
  public setNumber = '39';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Glaceon-GX';
  public fullName: string = 'Glaceon-GX UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    HANDLE_ABILITY_LOCK(
      effect,
      ({ player, card }) => {
        if (!IS_ABILITY_LOCKER_ACTIVE(state, player, this)) {
          return false;
        }

        if (!card.hasTag(CardTag.POKEMON_GX) && !card.hasTag(CardTag.POKEMON_EX)) {
          return false;
        }

        const opponent = StateUtils.getOpponent(state, player);
        const lockerOwner = player.active.getPokemonCard() === this ? player : opponent;

        // Opponent's GX/EX only (in play, hand, and discard).
        try {
          const targetOwner = StateUtils.findOwner(state, StateUtils.findCardList(state, card));
          if (targetOwner === lockerOwner) {
            return false;
          }
        } catch {
          return false;
        }

        // Check + PowerEffect: Freezing Gaze must itself be usable (e.g. Path to the Peak).
        return LOCKER_ABILITY_APPLIES(store, state, lockerOwner, this, this.powers[0], card);
      },
      {
        exemptPowerNames: ['Freezing Gaze'],
        error: GameMessage.BLOCKED_BY_ABILITY,
      },
    );

    // Frost Spear
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some((b) => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false },
        ),
        (targets) => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        },
      );
    }

    // Polar Spear-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      const opponent = StateUtils.getOpponent(state, player);

      effect.damage = 5 * opponent.active.damage;
    }

    return state;
  }
}
