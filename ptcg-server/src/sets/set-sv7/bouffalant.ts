import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, GamePhase, PlayerType, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';


export class Bouffalant extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Curly Wall',
    powerType: PowerType.ABILITY,
    text: 'If you have any other Bouffalant in play, each of your Basic [C] Pokémon take 60 less damage from your opponent\'s attacks(after applying Weakness and Resistance).You can\'t apply more than 1 Curly Wall Ability at a time.'
  }];
  public attacks = [{
    name: 'Boundless Power',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 130,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'SCR';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '119';
  public name: string = 'Bouffalant';
  public fullName: string = 'Bouffalant SV7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const player = StateUtils.findOwner(state, cardList);
      let bouffalantCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Bouffalant') {
          bouffalantCount++;
        }
      });

      if (bouffalantCount < 2) {
        return state;
      }

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (effect.damageReduced) {
        return state;
      }

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

      const targetPokemon = effect.target.getPokemonCard();
      if (targetPokemon && targetPokemon.cardType === CardType.COLORLESS && targetPokemon.stage === Stage.BASIC && StateUtils.findOwner(state, effect.target) === player) {
        effect.damage = Math.max(0, effect.damage - 60);
        effect.damageReduced = true;
      }
    }
    return state;
  }
}