import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, ChoosePokemonPrompt, PlayerType, SlotType, GameError } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';


export class RagingBoltex extends PokemonCard {

  public regulationMark = 'H';

  public tags = [ CardTag.POKEMON_ex, CardTag.ANCIENT ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public cardTypez: CardType = CardType.RAGING_BOLT_EX;

  public hp: number = 240;

  public weakness = [ ];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Bursting Roar',
      cost: [CardType.COLORLESS ],
      damage: 0,
      text: 'Discard your hand and draw 6 cards.'
    },
    {
      name: 'Bellowing Thunder',
      cost: [CardType.LIGHTNING, CardType.FIGHTING ],
      damage: 70,
      damageCalculation: 'x',
      text: 'You may discard any amount of Basic Energy from your Pokémon. This attack does 70 damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name: string = 'Raging Bolt ex';

  public fullName: string = 'Raging Bolt ex TEF';

  // Implement power
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      player.hand.moveTo(player.discard);
      player.deck.moveTo(player.hand, 6);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH], 
        { min: 1, max: 6, allowCancel: true }
      ), targets => {
        targets.forEach(target => {

          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            target, // Card source is target Pokemon
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { min: 1, allowCancel: true }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {

              let totalDiscarded = 0;

              const discardEnergy = new DiscardCardsEffect(effect, cards);
              discardEnergy.target = target;

              totalDiscarded += discardEnergy.cards.length;

              store.reduceEffect(state, discardEnergy);

              console.log('Total discarded:' + totalDiscarded);

              effect.damage += totalDiscarded * 70;
              console.log('Total Damage: ' + effect.damage);

              return state;
            }});
        });
        effect.damage -= 70;
        return state;
      });
    }
    return state;
  }
}