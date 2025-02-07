import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseAttackPrompt, Card, Resistance, GameLog, CardList, Attack } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

function* useSeekInspiration(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = effect.opponent;

  let maxRetries = 3;
  
  if (player.deck.cards.length <= 0) { return state; }  // Attack does nothing if deck is empty.
  const deckTop = new CardList();
  player.deck.moveTo(deckTop, 1);
  const topdeck: Card = deckTop.cards[0];  // This is the card we're looking at.
  deckTop.moveTo(player.discard);

  if (!(topdeck instanceof PokemonCard) || (topdeck.tags.includes(
    CardTag.POKEMON_EX || CardTag.POKEMON_GX || CardTag.POKEMON_LV_X || CardTag.POKEMON_V ||
    CardTag.POKEMON_ex || CardTag.PRISM_STAR || CardTag.RADIANT || CardTag.POKEMON_VMAX || CardTag.POKEMON_VSTAR
  ))) {
    return state;
  }

  const discardPokemon = player.discard.cards.filter(card => card.superType === SuperType.POKEMON) as PokemonCard[];
  const pokemonInQuestion = discardPokemon.filter(card => card === topdeck);

  for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
    let selected: any;
    yield store.prompt(state, new ChooseAttackPrompt(
      player.id,
      GameMessage.CHOOSE_ATTACK_TO_COPY,
      pokemonInQuestion,
      { allowCancel: true }
    ), result => {
      selected = result;
      next();
    });

    const attack: Attack | null = selected;

    if (attack === null) {
      return state; // Player chose to cancel
    }

    try {
      store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: attack.name
      });

      const attackEffect = new AttackEffect(player, opponent, attack);
      state = store.reduceEffect(state, attackEffect);

      if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
      }

      if (attackEffect.damage > 0) {
        const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
      }

      return state; // Successfully executed attack, exit the function
    } catch (error) {
      console.log('Attack failed:', error);
      retryCount++;
      if (retryCount >= maxRetries) {
        console.log('Max retries reached. Exiting loop.');
        return state;
      }
    }
  }
}

export class Slowking extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Slowpoke';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance: Resistance[] = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Seek Inspiration',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 0,
      text: 'Discard the top card of your deck, and if that card is a Pokemon that doesn\'t have a Rule Box, ' +
        'choose 1 of its attacks and use it as this attack. (Pokemon ex, Pokemon V, etc. have Rule Boxes.)'
    },
    { name: 'Super Psy Bolt', cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS], damage: 120, text: '' }
  ];

  public set: string = 'SCR';

  public name: string = 'Slowking';

  public fullName: string = 'Slowking SCR';

  public setNumber: string = '58';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useSeekInspiration(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
