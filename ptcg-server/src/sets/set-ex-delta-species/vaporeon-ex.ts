import { CardTag, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS } from '../../game/store/prefabs/attack-effects';
import { CONFIRMATION_PROMPT, DRAW_UP_TO_X_CARDS, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Vaporeonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers: Power[] = [{
    name: 'Evolutionary Swirl',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Vaporeon ex from your hand to evolve 1 of your Pokémon, you may have your opponent shuffle his or her hand into his or her deck. Then, your opponent draws up to 4 cards.'
  }];

  public attacks = [{
    name: 'Fastwave',
    cost: [W, C],
    damage: 40,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
  },
  {
    name: 'Hydro Splash',
    cost: [W, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'DS';
  public setNumber: string = '110';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vaporeon ex';
  public fullName: string = 'Vaporeon ex DS';

  public readonly FLAME_SCREEN_MARKER = 'FLAME_SCREEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          // Shuffle hand into deck
          MOVE_CARDS(store, state, opponent.hand, opponent.deck, { sourceCard: this, sourceEffect: this.powers[0] });
          SHUFFLE_DECK(store, state, opponent);
          // Draw up to 4 cards
          DRAW_UP_TO_X_CARDS(store, state, opponent, 4);
        }
      });
    }

    // Fastwave
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 40);
    }

    return state;
  }
}