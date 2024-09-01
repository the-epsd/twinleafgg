import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, GameError, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Dusknoir extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dusclops';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 160;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Cursed Blast',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 13 damage counters on 1 of your opponent\'s Pokémon. If you placed any damage counters in this way, this Pokémon is Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Shadow Bind',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 150,
      text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
    }
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '20';

  public name: string = 'Dusknoir';

  public fullName: string = 'Dusknoir SFA';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.attackMarker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof RetreatEffect && effect.player.active.attackMarker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.attackMarker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 130;
        });
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.damage += 999;
          }
        });
      });
    }
    return state;
  }
}