import { Card, CardType, ChooseEnergyPrompt, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike } from "../../game";
import { DiscardCardsEffect } from "../../game/store/effects/attack-effects";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from "../../game/store/prefabs/effect-of-attack-prefabs";

export class Mewtwo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Psychic',
    cost: [P, C],
    damage: 10,
    text: 'Does 10 damage plus 10 more damage for each Energy card attached to the Defending Pokémon.'
  },
  {
    name: 'Barrier',
    cost: [P, P],
    text: 'Discard 1 [P] Energy card attached to Mewtwo in order to prevent all effects of attacks, including damage, done to Mewtwo during your opponent\'s next turn.',
    damage: 0
  }];

  public set = 'BS';
  public name = 'Mewtwo';
  public fullName = 'Mewtwo BS';
  public setNumber = '10';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);

      effect.damage += energyCount * 10;
    }
    // Barrier
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.PSYCHIC],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);

        PREVENT_DAMAGE(store, state, effect, this);
        PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
      });
    }

    return state;
  }
}
