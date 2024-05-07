import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, Card, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GameMessage } from '../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class RapidStrikeUrshifuVMAX extends PokemonCard {

  public tags = [ CardTag.POKEMON_VMAX, CardTag.RAPID_STRIKE ];

  public regulationMark = 'E';
  
  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Rapid Strike Urshifu V';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 330;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Gale Thrust',
      cost: [CardType.COLORLESS],
      damage: 30,
      text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 120 more damage.'
    },
    {
      name: 'G-Max Rapid Flow',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Discard all Energy from this Pokémon. This attack does 120 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '88';

  public name: string = 'Rapid Strike Urshifu VMAX';

  public fullName: string = 'Rapid Strike Urshifu VMAX BST';



  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false;
      console.log('movedToActiveThisTurn = false');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (this.movedToActiveThisTurn) {
        effect.damage += 120;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    
      const max = Math.min(2);
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { min: max, max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        if (targets.includes(opponent.active)) {
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 120);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        }});
    }
    return state;
  }
}