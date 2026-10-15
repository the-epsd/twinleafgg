import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, ChooseCardsPrompt, EnergyCard, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Luxray extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Luxio';
  public hp: number = 120;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: 30 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Gleam Eyes',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Luxray from your hand to evolve 1 of your Pokémon, you may look at your opponent\'s hand. If your opponent\'s Bench isn\'t full, choose 1 Basic Pokémon from your opponent\'s hand, and put it onto his or her Bench. Then, switch it with the Defending Pokémon.'
  }];

  public attacks = [{
    name: 'Lightning Star',
    cost: [L, L, L, L],
    damage: 80,
    text: 'Move all Lightning Energy attached to Luxray to 1 of your Benched Pokémon. (Ignore this effect if you don\'t have any Benched Pokémon.)'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Luxray';
  public fullName: string = 'Luxray DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gleam Eyes
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);
        const slots: PokemonCardList[] = opponent.bench.filter(b => b.cards.length === 0);

        if (opponent.hand.cards.length === 0) {
          return;
        }

        // Bench full: still look at hand
        if (slots.length === 0) {
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            opponent.hand,
            {},
            { min: 0, max: 0, allowCancel: true }
          ), () => { });
          return;
        }

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_BASIC_POKEMON_TO_BENCH,
          opponent.hand,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 0, max: 1, allowCancel: true }
        ), selected => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }

          MOVE_CARDS(store, state, opponent.hand, slots[0], { cards, sourceCard: this });
          slots[0].pokemonPlayedTurn = state.turn;
          opponent.switchPokemon(slots[0]);
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Lightning Star
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      const attachedEnergies = player.active.cards.filter(card =>
        card instanceof EnergyCard && card.provides.includes(CardType.LIGHTNING)
      );
      if (attachedEnergies.length === 0) {
        return state;
      }

      const blocked = player.active.cards
        .map((c, i) => (attachedEnergies.includes(c) ? -1 : i))
        .filter(i => i !== -1);

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        {
          allowCancel: false,
          min: attachedEnergies.length,
          max: attachedEnergies.length,
          sameTarget: true,
          blocked,
        }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.active, target, { cards: [transfer.card], sourceCard: this });
        }
      });
    }

    return state;
  }
}
