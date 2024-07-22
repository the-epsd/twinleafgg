import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Starmie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Staryu';
  public cardType: CardType = CardType.WATER;
  public hp: number = 90;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Multishot Star',
    cost: [CardType.WATER],
    damage: 0,
    text: 'Discard any amount of [W] Energy from this Pokémon. Then, for each Energy you discarded in this way, choose 1 of your opponent\'s Pokémon and do 30 damage to it. (You can choose the same Pokémon more than once.) This damage isn\'t affected by Weakness or Resistance. '
  }];

  public set: string = 'FST';
  public regulationMark = 'E';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Starmie';
  public fullName: string = 'Starmie FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;



      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        player.active, // Card source is target Pokemon
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {

          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;

          store.reduceEffect(state, discardEnergy);

          // For every energy discarded, target a brodie and do 30 to it. Same target can be selected multiple times
          discardEnergy.cards.forEach(card => {
            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
              PlayerType.TOP_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { min: 1, max: 1, allowCancel: false }
            ), selected => {
              const targets = selected || [];
              targets.forEach(target => {

                //damaging target
                const damageEffect = new PutDamageEffect(effect, 30);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
              });
            });
          });
        }

        return state;
      });
    }

    return state;
  }
}