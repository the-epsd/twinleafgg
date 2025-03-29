import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, SlotType, GameError, GameMessage, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class HolonsMagnemite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.HOLONS];
  public cardType: CardType = M;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Special Energy Effect',
    powerType: PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
    useFromHand: true,
    text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon. While attached, this card is a Special Energy card and provides [C] Energy. [Click this effect to use it.]'
  }];

  public attacks = [{
    name: 'Linear Attack',
    cost: [M],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Holon\'s Magnemite';
  public fullName: string = 'Holon\'s Magnemite DS';

  public provides: CardType[] = [CardType.COLORLESS];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // The Special Energy Stuff
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.energyPlayedTurn === state.turn) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      player.energyPlayedTurn = state.turn;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }

        // Moving it onto the pokemon
        effect.preventDefault = true;
        player.hand.moveCardTo(this, targets[0]);

        // Reposition it to be with energy cards (at the beginning of the card list)
        targets[0].cards.unshift(targets[0].cards.splice(targets[0].cards.length - 1, 1)[0]);

        // Register this card as energy in the PokemonCardList
        targets[0].addPokemonAsEnergy(this);
      });
    }

    // Provide energy when attached as energy and included in CheckProvidedEnergyEffect
    if (effect instanceof CheckProvidedEnergyEffect
      && effect.source.cards.includes(this)) {

      // Check if this card is registered as an energy card in the PokemonCardList
      const pokemonList = effect.source;
      if (pokemonList.energyCards.includes(this)) {
        effect.energyMap.push({ card: this, provides: this.provides });
      }
    }

    // Reset the flag when the card is discarded
    if (effect instanceof DiscardCardsEffect && effect.target.cards.includes(this)) {
      effect.target.removePokemonAsEnergy(this);
    }

    // Linear Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
    }

    return state;
  }
}