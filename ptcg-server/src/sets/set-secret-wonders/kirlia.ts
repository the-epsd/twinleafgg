import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, TrainerCard, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Kirlia extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Ralts';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.PSYCHIC, value: +20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Psychic Research',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Search your discard pile for a Supporter card and use the effect of that card as the effect of this attack. (The Supporter card remains in your discard pile.)'
    },
    {
      name: 'Telekinesis',
      cost: [P, C, C],
      damage: 0,
      text: 'Choose 1 of your opponent\’s Pokémon. This attack does 40 damage to that Pokémon. This attack\’s damage isn\’t affected by Weakness or Resistance.'
    }
  ];

  public set: string = 'SW';

  public name: string = 'Kirlia';

  public fullName: string = 'Kirlia SW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '53';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const supportersInDiscard = player.discard.cards.filter(card => {
        card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER;
      });

      if (!supportersInDiscard) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_COPY_EFFECT,
        player.discard,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        const trainerCard = cards[0] as TrainerCard;
        const playTrainerEffect = new TrainerEffect(player, trainerCard);
        store.reduceEffect(state, playTrainerEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 40);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }

}