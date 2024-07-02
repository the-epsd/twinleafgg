import { Attack, CardTarget, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class TechnicalMachineBlindside extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'G';

  public tags = [ ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '176';

  public name: string = 'Technical Machine: Blindside';

  public fullName: string = 'Technical Machine: Blindside PAR';

  public attacks: Attack[] = [{
    name: 'Blindside',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 0,
    text: 'You can use this attack only when your opponent has exactly 1 Prize card remaining.' 
  }];
  
  public text: string =
    'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonAttacksEffect && effect.player.active.getPokemonCard()?.tools.includes(this) &&
!effect.attacks.includes(this.attacks[0])) {
      const player = effect.player;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      effect.attacks.push(this.attacks[0]);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
        if (cardList.cards.includes(this)) {
          try {
            const toolEffect = new ToolEffect(player, this);
            store.reduceEffect(state, toolEffect);
          } catch {
            return state;
          }

          cardList.moveCardTo(this, player.discard);
          cardList.tool = undefined;
        }
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      const blocked: CardTarget[] = [];
  
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        effect.damage = 120;
      }
  
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage == 0) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }
        if (cardList.damage > 0) {
          return state;
        } else {
          blocked.push(target);
        }
      });
  
      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false, blocked: blocked }
      ), target => {
        if (!target || target.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 100);
        damageEffect.target = target[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }

}

