import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, StateUtils, EnergyCard, SuperType, ChooseCardsPrompt, GameMessage } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaClefableex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Clefairy';
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_SV_MEGA];
  public cardType: CardType = P;
  public hp: number = 320;
  public weakness = [{ type: M }];
  public retreat = [C];

  public powers = [{
    name: 'Wings of Light',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of your opponent\'s Abilities done to this Pokemon.'
  }];

  public attacks = [{
    name: 'Shooting Moon',
    cost: [P, P],
    damage: 120,
    text: 'You may discard up to 4 Energy cards from you hand. If you do, this attack does 40 more damage for each card discarded in this way.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';
  public name: string = 'Mega Clefable ex';
  public fullName: string = 'Mega Clefable ex M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wings of Light - Prevent opponent ability effects on this Pokemon
    if (effect instanceof PowerEffect && effect.target && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard === this) {
        const targetOwner = StateUtils.findOwner(state, effect.target);
        const opponent = StateUtils.getOpponent(state, targetOwner);

        // Only prevent effects from opponent's abilities
        if (targetOwner === opponent) {
          // Check if ability is blocked (to allow our own abilities)
          if (!IS_ABILITY_BLOCKED(store, state, targetOwner, this)) {
            effect.preventDefault = true;
            return state;
          }
        }
      }
    }

    // Shooting Moon - discard energy from hand for damage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energiesInHand = player.hand.cards.filter(card =>
        card instanceof EnergyCard && card.superType === SuperType.ENERGY
      );

      if (energiesInHand.length === 0) {
        return state;
      }

      const maxToDiscard = Math.min(4, energiesInHand.length);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: maxToDiscard }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          const discardEffect = new DiscardCardsEffect(effect, cards);
          discardEffect.target = player.active;
          store.reduceEffect(state, discardEffect);
          player.hand.moveCardsTo(cards, player.discard);
          effect.damage += cards.length * 40;
        }
      });
    }

    return state;
  }
}
