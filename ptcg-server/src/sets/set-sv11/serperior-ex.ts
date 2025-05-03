import { PokemonCard, Stage, CardType, StoreLike, State, CardTag, ChooseCardsPrompt } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { GameMessage, ShuffleDeckPrompt } from "../../game";
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";
import { PutDamageEffect } from "../../game/store/effects/attack-effects";

export class Serperiorex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Servine';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 320;
  public weakness = [{ type: R, value: 2 }];
  public retreat = [C, C];

  public abilities = [{
    name: 'Royal Cheer',
    text: 'Attacks used by your Pokémon do 20 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Grass Order',
    cost: [G, C, C, C],
    damage: 150,
    text: 'You may search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Serperior ex';
  public fullName: string = 'Serperior ex SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Royal Cheer ability - increase damage by 20
    if (effect instanceof PutDamageEffect && effect.target === effect.opponent.active) {
      const player = effect.player;

      // Check if this card is in play
      const isInPlay = player.bench.some(b => b.cards.some(c => c === this)) ||
        player.active.cards.some(c => c === this);

      if (isInPlay && !IS_ABILITY_BLOCKED(store, state, player, this)) {
        effect.damage += 20;
      }
    }

    // Grass Order attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 3, allowCancel: false }
      ), selected => {
        if (selected && selected.length > 0) {
          player.deck.moveCardsTo(selected, player.hand);
        }
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}
