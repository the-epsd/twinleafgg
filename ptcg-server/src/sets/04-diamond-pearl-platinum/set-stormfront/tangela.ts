import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class Tangela extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Ingrain',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If tails, this attack does nothing. If heads, search your deck for a Grass Energy card and attach it to Tangela. Shuffle your deck afterward. If you do, prevent all effects of an attack, including damage, done to Tangela during your opponent\'s next turn.'
  },
  {
    name: 'Tickle',
    cost: [G, C],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Tangela';
  public fullName: string = 'Tangela SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ingrain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          effect.preventDefault = true;
          return;
        }
        const blocked: number[] = [];
        player.deck.cards.forEach((card, index) => {
          if (!(card instanceof EnergyCard && card.provides.includes(CardType.GRASS))) {
            blocked.push(index);
          }
        });
        store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.deck,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          { superType: SuperType.ENERGY },
          { allowCancel: true, min: 0, max: 1, blocked },
        ), transfers => {
          transfers = transfers || [];
          if (transfers.length === 0) {
            SHUFFLE_DECK(store, state, player);
            return;
          }
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.deck, target, {
              cards: [transfer.card],
              sourceCard: this,
              sourceEffect: this.attacks[0],
            });
          }
          SHUFFLE_DECK(store, state, player);
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        });
      });
    }

    // Tickle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
