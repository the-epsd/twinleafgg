import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import {
  PowerType,
  StoreLike,
  State,
} from '../../../game';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { COPY_ATTACK_VIA_ABILITY } from '../../../game/store/prefabs/copy-attack-prefabs';
import {
  BLOCK_IF_GX_ATTACK_USED,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class MarshadowGX extends PokemonCard {
  protected _tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType[] = [CardType.FIGHTING];

  public hp: number = 150;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Shadow Hunt',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'This Pokémon can use the attacks of any Basic Pokémon in your discard pile. (You still need the necessary Energy to use each attack.)',
    },
  ];

  public attacks = [
    {
      name: 'Beatdown',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 120,
      text: '',
    },
    {
      name: 'Peerless Hundred Blows-GX',
      cost: [CardType.FIGHTING],
      damage: 50,
      text: "This attack does 50 damage times the amount of basic Energy attached to this Pokémon. (You can't use more than 1 GX attack in a game.)",
    },
  ];

  public set: string = 'BUS';

  public setNumber = '80';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Marshadow-GX';

  public fullName: string = 'Marshadow-GX BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const extraCards = player.discard.cards.filter(
        (card): card is PokemonCard =>
          card instanceof PokemonCard &&
          !(card instanceof MarshadowGX) &&
          card.stage === Stage.BASIC,
      );
      return COPY_ATTACK_VIA_ABILITY(store, state, effect, {
        copycatCard: this,
        extraCards,
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap.reduce(
        (left, p) => left + p.provides.length,
        0,
      );

      effect.damage = opponentEnergyCount * 50;
    }

    return state;
  }
}
