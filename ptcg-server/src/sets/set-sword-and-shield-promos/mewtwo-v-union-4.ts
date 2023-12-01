import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, Format, PokemonType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameMessage } from '../../game/game-message';
import { GameError } from '../../game/game-error';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, StateUtils } from '../..';
import { MewtwoVUnion1 } from './mewtwo-v-union-1';
// import { Card } from '../..';

export class MewtwoVUnion4 extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 0;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Propagation',
    useFromDiscard: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokemon is in '
      + 'your discard pile, you may put this Pokemon into your hand.'
  }];

  public attacks = [{
    name: 'Union Gain',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Attach up to 2 [P] Energy cards from your discard pile to this Pokémon.'
  }];

  public set: string = 'PLF';

  public name: string = 'MewtwoVUnion1';

  public fullName: string = 'MewtwoVUnion1 PLF';

  public readonly MEWTWO_V_UNION_USED = 'MEWTWO_V_UNION_USED';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if ((effect instanceof PlayPokemonEffect) && effect.pokemonCard === this) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Check if card is in the discard
      if (player.discard.cards.includes(this) === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let mewtwoVUnionCanBePlayed1 = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (player.discard.cards.includes(new MewtwoVUnion1()) === true) {
          mewtwoVUnionCanBePlayed1 = true;
        }
      });

      //   let mewtwoVUnionCanBePlayed2 = false;
      //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      //     if (player.discard.cards.includes(new MewtwoVUnion2()) === true) {
      //       mewtwoVUnionCanBePlayed2 = true;
      //     }
      //   });

      //   let mewtwoVUnionCanBePlayed3 = false;
      //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      //     if (player.discard.cards.includes(new MewtwoVUnion3()) === true) {
      //       mewtwoVUnionCanBePlayed3 = true;
      //     }
      //   });

      //   let mewtwoVUnionCanBePlayed4 = false;
      //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      //     if (player.discard.cards.includes(new MewtwoVUnion4()) === true) {
      //       mewtwoVUnionCanBePlayed4 = true;
      //     }
      //   });

      //   if (mewtwoVUnionCanBePlayed1 && mewtwoVUnionCanBePlayed2 && mewtwoVUnionCanBePlayed3 && mewtwoVUnionCanBePlayed4) {
      if (mewtwoVUnionCanBePlayed1) {

        const MewTwoVUnion: PokemonCard = {
          name: 'Mewtwo V-Union',
          set: 'SWSH',
          superType: SuperType.POKEMON,
          format: Format.STANDARD,
          fullName: 'Mewtwo V-Union',
          id: 0,
          regulationMark: 'E',
          tags: [CardTag.POKEMON_V],
          setNumber: '6',
          set2: 'v-unionspecialset',
          cardType: CardType.PSYCHIC,
          cardTag: [],
          pokemonType: PokemonType.NORMAL,
          evolvesFrom: '',
          stage: Stage.BASIC,
          retreat: [CardType.COLORLESS, CardType.COLORLESS],
          hp: 310,
          weakness: [{ type: CardType.DARK }],
          resistance: [{ type: CardType.FIGHTING, value: -30 }],
          movedToActiveThisTurn: false,
          powers: [],
          attacks: [    {
            name: 'Attack 1',
            cost: [ CardType.COLORLESS],
            damage: 10,
            text: ''
          }],
          reduceEffect: function (store: StoreLike, state: State, effect: Effect): State {
            if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
              const player = effect.player;
              const opponent = StateUtils.getOpponent(state, player);
            
              const defending = opponent.active.getPokemonCard();
              if (!defending || defending.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX)) {
                effect.damage += 120;
                return state;
              }  
              return state;
            }
            return state;
          }
        };
            
        const playPokemonEffect = new PlayPokemonEffect(effect.player, MewTwoVUnion, player.bench[0]) as PlayPokemonEffect;
        state = store.reduceEffect(state, playPokemonEffect);

        // player.marker.addMarker(this.PROPAGATION_MAREKER, this);
        player.discard.moveCardTo(this, player.hand);

        return state;
      }

      return state;
    }
    return state;
  }
  

}