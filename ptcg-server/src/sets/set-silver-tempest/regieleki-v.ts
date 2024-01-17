import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ConfirmPrompt, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class RegielekiV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 200;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Switching Bolt',
      cost: [CardType.LIGHTNING],
      damage: 30,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
    },
    {
      name: 'Lightning Wall',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: 'During your opponent\'s next turn, this Pokémon takes 100 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'SIT';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '57';

  public name: string = 'Regieleki V';

  public fullName: string = 'Regieleki V SIT';

  public readonly LEAF_GUARD_MARKER = 'LEAF_GUARD_MARKER';

  public readonly CLEAR_LEAF_GUARD_MARKER = 'CLEAR_LEAF_GUARD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }
  
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
      
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
            PlayerType.BOTTOM_PLAYER,
            [ SlotType.BENCH ],
            { allowCancel: true },
          ), selected => {
            if (!selected || selected.length === 0) {
              return state;
            }
            const target = selected[0];
            player.switchPokemon(target);
          });
        }

        if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);
      
          player.active.marker.addMarker(this.LEAF_GUARD_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_LEAF_GUARD_MARKER, this);
      
          if (effect instanceof PutDamageEffect
                          && effect.target.marker.hasMarker(this.LEAF_GUARD_MARKER)) {
            effect.damage -= 100;
            return state;
          }
          if (effect instanceof EndTurnEffect
                          && effect.player.marker.hasMarker(this.CLEAR_LEAF_GUARD_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_LEAF_GUARD_MARKER, this);
            const opponent = StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
              cardList.marker.removeMarker(this.LEAF_GUARD_MARKER, this);
            });
            return state;
          }
          return state;
        }
        return state;
      });
      return state;
    }
    return state;
  }
}