import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, ChooseEnergyPrompt, GameMessage, Card } from "../../game";
import { DiscardCardsEffect } from "../../game/store/effects/attack-effects";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { Effect } from "../../game/store/effects/effect";
import { THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from "../../game/store/prefabs/effect-of-attack-prefabs";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class ShiningMewtwo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = P;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Reflect Shield',
    cost: [P, L],
    damage: 0,
    text: 'If an attack does damage to Shining Mewtwo during your opponent\'s next turn (even if Shining Mewtwo is Knocked Out), flip a coin. If heads, prevent all damage done to Shining Mewtwo from that attack (any other effects of attacks still happen) and do 20 damage to the attacking Pokémon.'
  },
  {
    name: 'Psyburst',
    cost: [P, P, R],
    damage: 40,
    damageCalculation: '+',
    text: 'Discard a [R] Energy card attached to Shining Mewtwo or this attack does nothing. This attack does 40 damage plus 10 damage for each Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'N4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Shining Mewtwo';
  public fullName: string = 'Shining Mewtwo N4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reflect Shield
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, { damage: 20, coinFlipPrevent: true });
    }

    // Psyburst
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const hasFireEnergy = checkProvidedEnergy.energyMap.some(em =>
        em.provides.includes(CardType.FIRE) || em.provides.includes(CardType.ANY)
      );

      if (!hasFireEnergy) {
        effect.damage = 0;
        return state;
      }

      const checkOpponentEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkOpponentEnergy);
      const energyCount = checkOpponentEnergy.energyMap.reduce(
        (left, p) => left + p.provides.length,
        0,
      );
      effect.damage += energyCount * 10;

      return store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.FIRE],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        if (cards.length === 0) {
          effect.damage = 0;
          return;
        }
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }
}
