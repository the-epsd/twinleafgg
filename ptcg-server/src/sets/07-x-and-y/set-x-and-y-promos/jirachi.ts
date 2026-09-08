import { Attack, Card, CardTarget, CardType, ChooseCardsPrompt, EnergyType, GameMessage, PlayerType, PokemonCard, SpecialCondition, Stage, State, StateUtils, StoreLike, SuperType } from "../../../game";
import { DiscardCardsEffect } from "../../../game/store/effects/attack-effects";
import { CheckProvidedEnergyEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Jirachi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [M];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Stardust',
    cost: [C],
    damage: 10,
    text: "Discard a Special Energy attached to your opponent's Active Pokémon. If you do, prevent all effects of attacks, including damage, done to this Pokémon during your opponent's next turn.",
  },
  {
    name: 'Dream Dance',
    cost: [M, C],
    text: 'Both Active Pokémon are now Asleep.',
    damage: 20,
  }];

  public set: string = 'XYP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Jirachi';
  public fullName: string = 'Jirachi XYP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stardust
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let hasPokemonWithEnergy = false;
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.energies.cards.some((c) => c.energyType === EnergyType.SPECIAL)) {
          hasPokemonWithEnergy = true;
        } else {
          blocked.push(target);
        }
      });

      if (!hasPokemonWithEnergy) {
        return state;
      }

      state = store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.active,
          { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
          { min: 1, max: 1, allowCancel: true },
        ),
        (energy) => {
          const cards: Card[] = energy || [];
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = opponent.active;
          store.reduceEffect(state, discardEnergy);

          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        },
      );
    }
    // Dream Dance
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      player.active.addSpecialCondition(SpecialCondition.ASLEEP);
    }

    return state;
  }
}
