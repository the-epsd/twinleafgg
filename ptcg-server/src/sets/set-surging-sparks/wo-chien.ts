import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Wochien extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    { name: 'Hazardous Greed', cost: [CardType.GRASS, CardType.COLORLESS], damage: 20, text: 'If there are 3 or fewer cards in your deck, this attack also does 120 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)' },
    { name: 'Entangling Whip', cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS], damage: 130, text: 'Discard the top 3 cards of your deck.' }
  ];

  public set: string = 'SSP';

  public name: string = 'Wo-chien';

  public fullName: string = 'Wo-chien SSP';

  public setNumber: string = '15';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hazardous Greed
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length <= 3) {
        const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
        if (benched === 0) {
          return state;
        }
        const count = Math.min(2, benched);

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false, min: count, max: count }
        ), targets => {
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 120);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        });
      }
    }

    // Entangling Whip
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      player.deck.moveTo(player.discard, 3);
    }

    return state;
  }
}