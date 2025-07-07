import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, CardTarget, SlotType, GameError, GameMessage, ChoosePokemonPrompt, ChooseEnergyPrompt, Card, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_UP_TO_X_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class HolonsCastform extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.HOLONS];
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Special Energy Effect',
    powerType: PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
    useFromHand: true,
    text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon that already has an Energy card attached to it. When you attach this card, return an Energy card attached to that Pokémon to your hand. While attached, this card is a Special Energy card and provides every type of Energy but 2 Energy at a time. (Has no effect other than providing Energy.) [Click this effect to use it.]'
  }];

  public attacks = [{
    name: 'Delta Draw',
    cost: [C],
    damage: 0,
    text: 'Count the number of Pokémon you have in play that has δ on its card. Draw up to that many cards.'
  }];

  public set: string = 'HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Holon\'s Castform';
  public fullName: string = 'Holon\'s Castform HP';

  // Which energies this provides when not attached as an energy
  public provides: CardType[] = [CardType.COLORLESS];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // The Special Energy Stuff
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.energyPlayedTurn === state.turn) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      player.energyPlayedTurn = state.turn;

      let isEnergyOnBench = false;
      let isEnergyOnActive = false;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const activeEnergyCount = checkProvidedEnergy.energyMap.length;

      if (activeEnergyCount > 0) { isEnergyOnActive = true; }

      const blockedTo: CardTarget[] = [];
      if (!isEnergyOnActive) {
        const target: CardTarget = {
          player: PlayerType.BOTTOM_PLAYER,
          slot: SlotType.ACTIVE,
          index: 0
        };
        blockedTo.push(target);
      }

      player.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }

        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, bench);
        state = store.reduceEffect(state, checkProvidedEnergy);
        const energyCount = checkProvidedEnergy.energyMap.length;

        if (energyCount > 0) {
          isEnergyOnBench = true;
        } else {
          const target: CardTarget = {
            player: PlayerType.BOTTOM_PLAYER,
            slot: SlotType.BENCH,
            index
          };
          blockedTo.push(target);
        }
      });

      if (!isEnergyOnActive && !isEnergyOnBench) { throw new GameError(GameMessage.CANNOT_USE_POWER); }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked: blockedTo }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }

        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, targets[0]);
        state = store.reduceEffect(state, checkProvidedEnergy);

        return store.prompt(state, new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_HAND,
          checkProvidedEnergy.energyMap,
          [CardType.COLORLESS],
          { allowCancel: false }
        ), energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          store.log(state, GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: '' + cards[0].name });
          targets[0].moveCardsTo(cards, player.hand);

          // Moving it onto the pokemon
          effect.preventDefault = true;
          player.hand.moveCardTo(this, targets[0]);

          // Reposition it to be with energy cards (at the beginning of the card list)
          targets[0].cards.unshift(targets[0].cards.splice(targets[0].cards.length - 1, 1)[0]);

          // Register this card as energy in the PokemonCardList
          targets[0].addPokemonAsEnergy(this);
        });
      });
    }

    // Provide energy when attached as energy and included in CheckProvidedEnergyEffect
    if (effect instanceof CheckProvidedEnergyEffect
      && effect.source.cards.includes(this)) {

      // Check if this card is registered as an energy card in the PokemonCardList
      const pokemonList = effect.source;
      if (pokemonList.energyCards.includes(this)) {
        effect.energyMap.push({ card: this, provides: [CardType.ANY, CardType.ANY] });
      }
    }

    // Reset the flag when the card is discarded
    if (effect instanceof DiscardCardsEffect && effect.target.cards.includes(this)) {
      effect.target.removePokemonAsEnergy(this);
    }

    // Delta Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let deltasInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard()?.tags.includes(CardTag.DELTA_SPECIES)) {
          deltasInPlay++;
        }
      });

      DRAW_UP_TO_X_CARDS(store, state, player, deltasInPlay);
    }

    return state;
  }
}