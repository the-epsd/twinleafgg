import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, CardTarget, SlotType, GameError, GameMessage, ChoosePokemonPrompt, ChooseEnergyPrompt, Card, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class HolonsMagneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Holon\'s Magnemite';
  public tags = [CardTag.HOLONS];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Special Energy Effect',
    powerType: PowerType.HOLONS_SPECIAL_ENERGY_EFFECT,
    useFromHand: true,
    text: 'You may attach this as an Energy card from your hand to 1 of your Pokémon that already has an Energy card attached to it. When you attach this card, return an Energy card attached to that Pokémon to your hand. While attached, this card is a Special Energy card and provides every type of Energy but 2 Energy at a time. (Has no effect other than providing Energy.) [Click this effect to use it.]'
  }];

  public attacks = [{
    name: 'Extra Ball',
    cost: [M, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is Pokémon-ex, this attack does 30 damage plus 20 more damage.'
  }];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Holon\'s Magneton';
  public fullName: string = 'Holon\'s Magneton DS';

  // Which energies this provides when attached as an energy
  public provides: CardType[] = [CardType.ANY, CardType.ANY];

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
        effect.energyMap.push({ card: this, provides: this.provides });
      }
    }

    // Reset the flag when the card is discarded
    if (effect instanceof DiscardCardsEffect && effect.target.cards.includes(this)) {
      effect.target.removePokemonAsEnergy(this);
    }

    // Extra Ball
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, 20, CardTag.POKEMON_ex);
    }

    return state;
  }
}