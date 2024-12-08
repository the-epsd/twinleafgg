import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, PokemonCardList, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DrewTopdeckEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Metagross extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Metang';

  public regulationMark = 'F';

  public cardType: CardType = CardType.METAL;

  public hp: number = 170;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Emergency Entry',
    powerType: PowerType.ABILITY,
    useFromHand: true,
    text: 'Once during your turn, if you drew this Pokémon from your deck at the beginning of your turn and your Bench isn\'t full, before you put it into your hand, you may put it onto your Bench. If you do, draw 3 cards.'
  }];

  public attacks = [
    {
      name: 'Meteor Mash',
      cost: [CardType.METAL, CardType.COLORLESS],
      damage: 100,
      text: 'During your next turn, this Pokémon\'s Meteor Mash attack does 100 more damage (before applying Weakness and Resistance).'
    }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '119';

  public name: string = 'Metagross';

  public fullName: string = 'Metagross SIT';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DrewTopdeckEffect && effect.handCard === this) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (slots.length === 0) {
        return state;
      }
      
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const cards = player.hand.cards.filter(c => c.cards === this.cards);

          cards.forEach((card, index) => {
            player.hand.moveCardTo(card, slots[index]);
            slots[index].pokemonPlayedTurn = state.turn;
          });
          player.deck.moveTo(player.hand, 3);
        }
      });
    }


    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack added damage');
        effect.damage += 100;
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }
    return state;
  }
}