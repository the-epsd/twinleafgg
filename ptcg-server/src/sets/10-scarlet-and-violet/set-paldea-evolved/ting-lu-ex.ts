import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { PowerType } from '../../../game/store/card/pokemon-types';
import {
  ChoosePokemonPrompt,
  GameMessage,
  PlayerType,
  PokemonCardList,
  SlotType,
  StateUtils,
} from '../../../game';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import {
  HANDLE_ABILITY_LOCK,
  IS_ABILITY_LOCKER_ACTIVE,
  LOCKER_ABILITY_APPLIES,
} from '../../../game/store/prefabs/ability-lock';

export class TingLuex extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  protected _tags = [CardTag.POKEMON_ex];

  public cardType: CardType[] = [CardType.FIGHTING];

  public hp: number = 240;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Cursed Land',
      powerType: PowerType.ABILITY,
      abilityLock: true,
      text: "As long as this Pokémon is in the Active Spot, your opponent's Pokémon in play that have any damage counters on them have no Abilities, except for Pokémon ex.",
    },
  ];

  public attacks = [
    {
      name: 'Land Scoop',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: 150,
      text: "Put 2 damage counters on 1 of your opponent's Benched Pokémon.",
    },
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '127';

  public name: string = 'Ting-Lu ex';

  public fullName: string = 'Ting-Lu ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    HANDLE_ABILITY_LOCK(
      effect,
      ({ player, card }) => {
        if (!IS_ABILITY_LOCKER_ACTIVE(state, player, this)) {
          return false;
        }

        const cardList = StateUtils.findCardList(state, this);
        const owner = StateUtils.findOwner(state, cardList);
        const opponent = StateUtils.getOpponent(state, owner);

        let targetBelongsToOpponent = false;
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_cardList, pokemon) => {
          if (pokemon === card) {
            targetBelongsToOpponent = true;
          }
        });
        if (!targetBelongsToOpponent) {
          return false;
        }

        if (card.hasTag(CardTag.POKEMON_ex)) {
          return false;
        }

        const targetCardList = StateUtils.findCardList(state, card);
        if (!(targetCardList instanceof PokemonCardList) || targetCardList.damage <= 0) {
          return false;
        }

        // Check + PowerEffect: Cursed Land must itself be usable (e.g. Path to the Peak).
        return LOCKER_ABILITY_APPLIES(store, state, owner, this, this.powers[0], card);
      },
      {
        allowUseFromHand: true,
        allowUseFromDiscard: true,
        error: GameMessage.BLOCKED_BY_ABILITY,
      },
    );

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some((b) => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { max: 1, allowCancel: false },
        ),
        (targets) => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        },
      );

      return state;
    }
    return state;
  }
}
