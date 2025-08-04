import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { BLOCK_IF_GX_ATTACK_USED, DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK } from '../../game/store/prefabs/attack-effects';

export class MoltresZapdosArticunoGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public cardType: CardType = C;
  public hp: number = 300;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Trinity Burn',
    cost: [R, W, L, C],
    damage: 210,
    text: ''
  },
  {
    name: 'Sky Legends-GX',
    cost: [C],
    damage: 0,
    text: 'Shuffle this Pokémon and all cards attached to it into your deck. If this Pokémon has at least 1 extra [R], [W], and [L] Energy attached to it (in addition to this attack\'s cost), this attack does 110 damage to 3 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
  }
  ];

  public set: string = 'HIF';
  public setNumber: string = '44';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Moltres & Zapdos & Articuno-GX';
  public fullName: string = 'Moltres & Zapdos & Articuno-GX HIF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      // Check for the extra energy cost.
      const extraEffectCost: CardType[] = [R, W, L, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 3, allowCancel: false }
        ), selected => {
          const targets = selected || [];
          DAMAGE_OPPONENT_POKEMON(store, state, effect, 110, targets);
          SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
          return state;
        });
      } else {
        SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
      }

    }
    return state;
  }
}

