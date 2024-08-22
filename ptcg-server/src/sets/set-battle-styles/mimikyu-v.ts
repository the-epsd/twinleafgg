import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ConfirmPrompt, GameMessage, PokemonCardList, PowerType, StateUtils } from '../../game';
import { AbstractAttackEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class MimikyuV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 160;

  public weakness = [{
    type: CardType.DARK
  }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Dummmy Doll',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may prevent all damage done to this Mimikyu V by attacks from your opponent\'s Pokémon until the end of your opponent\'s next turn.'
  }];

  public attacks = [
    {
      name: 'Jealous Eyes',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: 'Put 3 damage counters on your opponent\'s Active Pokémon ' +
        'for each Prize card your opponent has taken. '
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public regulationMark = 'E';

  public name: string = 'Mimikyu V';

  public fullName: string = 'Mimikyu V BST';

  public readonly DUMMY_DOLL_MARKER: string = 'DUMMY_DOLL_MARKER';
  public readonly CLEAR_DUMMY_DOLL_MARKER: string = 'CLEAR_DUMMY_DOLL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

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
          const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
          cardList.marker.addMarker(this.DUMMY_DOLL_MARKER, this);
        }
      });

      return state;
    }

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.DUMMY_DOLL_MARKER, this)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        cardList.marker?.removeMarker(this.DUMMY_DOLL_MARKER, this);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();

      const damagePerPrize = 30 * prizesTaken;

      const damageEffect = new PutCountersEffect(effect, damagePerPrize);
      damageEffect.target = opponent.active;
      store.reduceEffect(state, damageEffect);
    }

    return state;
  }

}
