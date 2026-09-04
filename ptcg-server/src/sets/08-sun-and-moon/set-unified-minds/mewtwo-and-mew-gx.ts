import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import {
  PowerType,
  StoreLike,
  State,
  StateUtils,
  PlayerType,
} from '../../../game';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { COPY_ATTACK_VIA_ABILITY } from '../../../game/store/prefabs/copy-attack-prefabs';
import {
  BLOCK_IF_GX_ATTACK_USED,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class MewtwoMewGX extends PokemonCard {
  protected _tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType[] = [CardType.PSYCHIC];

  public hp: number = 270;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Perfection',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'This Pokemon can use the attacks of any Pokemon-GX or Pokemon-EX on your Bench ' +
        'or in your discard pile. (You still need the necessary Energy to use each attack.)',
    },
  ];

  public attacks = [
    {
      name: 'Miraculous Duo-GX',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 200,
      text:
        "If this Pokemon has at least 1 extra Energy attached to it (in addition to this attack's cost), " +
        "heal all damage from all of your Pokemon. (You can't use more than 1 GX attack in a game.)",
    },
  ];

  public set: string = 'UNM';

  public name: string = 'Mewtwo & Mew-GX';

  public fullName: string = 'Mewtwo & Mew-GX UNM';

  public setNumber: string = '71';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const extraCards = player.discard.cards.filter(
        (card): card is PokemonCard =>
          card instanceof PokemonCard &&
          !(card instanceof MewtwoMewGX) &&
          (card.hasTag(CardTag.POKEMON_EX) || card.hasTag(CardTag.POKEMON_GX)),
      );
      return COPY_ATTACK_VIA_ABILITY(store, state, effect, {
        copycatCard: this,
        filter: (cardList, card) =>
          cardList !== player.active &&
          (card.hasTag(CardTag.POKEMON_EX) || card.hasTag(CardTag.POKEMON_GX)),
        extraCards,
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const extraEffectCost: CardType[] = [
        CardType.PSYCHIC,
        CardType.PSYCHIC,
        CardType.COLORLESS,
        CardType.COLORLESS,
      ];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(
        checkProvidedEnergy.energyMap,
        extraEffectCost,
      );

      if (!meetsExtraEffectCost) {
        return state;
      }
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 999);
        store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }
}
