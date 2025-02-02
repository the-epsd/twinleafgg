import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt, GameMessage, SlotType } from '../../game';


export class PassimianSUM extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 110;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Fling',
    cost: [ CardType.FIGHTING ],
    damage: 0,
    text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }, {
    name: 'Team Play',
    cost: [ CardType.COLORLESS, CardType.COLORLESS ],
    damage: 10,
    text: 'This attack does 30 more damage for each of your Benched Passimian.'
  }];

  public set: string = 'SUM';

  public setNumber = '73';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Passimian';

  public fullName: string = 'Passimian SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
    
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }
    
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { allowCancel: false }
      ), targets => {
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let numPassimians = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === player.active) {
          return;
        }
        if (card.name === 'Passimian') {
          numPassimians++;
        }
      });

      effect.damage += numPassimians * 30;
    }

    return state;
  }

}
