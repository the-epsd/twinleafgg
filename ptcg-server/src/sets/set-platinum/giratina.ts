import { ConfirmPrompt, GameMessage, PlayerType, PowerType, ShuffleDeckPrompt, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Giratina extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: D }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Let Loose',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Giratina from your hand onto your Bench, you may use this power. Each player shuffles his or her hand into his or her deck and draws up to 4 cards. (You draw your cards first.)'
  }];

  public attacks = [{
    name: 'Earth Power',
    cost: [P, P, C],
    damage: 60,
    text: 'Flip 2 coins. This attack does 10 damage times the number of heads to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'PL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Giratina';
  public fullName: string = 'Giratina PL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          const cards = player.hand.cards.filter(c => c !== this);

          player.hand.moveCardsTo(cards, player.deck);
          opponent.hand.moveTo(opponent.deck);

          store.prompt(state, [
            new ShuffleDeckPrompt(player.id),
            new ShuffleDeckPrompt(opponent.id)
          ], deckOrder => {
            player.deck.applyOrder(deckOrder[0]);
            opponent.deck.applyOrder(deckOrder[1]);

            player.deck.moveTo(player.hand, 4);
            opponent.deck.moveTo(opponent.hand, 4);
          });
        }

        return state;
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let heads = 0;
      COIN_FLIP_PROMPT(store, state, player, result => { if (result) heads++; });
      COIN_FLIP_PROMPT(store, state, player, result => { if (result) heads++; });

      if (heads > 0) {
        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
          if (card !== opponent.active) {
            const damage = new PutDamageEffect(effect, (10 * heads));
            damage.target = card;
            store.reduceEffect(state, damage);
          }
        });
      }
    }

    return state;
  }
}