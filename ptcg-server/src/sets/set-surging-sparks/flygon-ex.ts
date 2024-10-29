import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, ConfirmPrompt, GameMessage, PlayerType, PokemonCard, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Flygonex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Vibrava';

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public regulationMark = 'H';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 310;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Storm Bug',
      cost: [CardType.FIGHTING],
      damage: 130,
      text: 'You may switch this Pokémon with a Pokémon on your Bench.'
    },
    {
      name: 'Peridot Sonic',
      cost: [CardType.WATER, CardType.FIGHTING, CardType.METAL],
      damage: 0,
      text: 'This attack does 100 damage to each of your opponent\'s Pokémon ex and Pokémon V. (Don\'t apply Weakness or Resistance for this damage.)'
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '106';

  public name: string = 'Flygon ex';

  public fullName: string = 'Flygon ex SV7a';

  public stormBug: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.stormBug = true;
    }

    if (effect instanceof EndTurnEffect && this.stormBug == true) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (!hasBenched) {
        return state;
      }

      this.stormBug = false;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_SWITCH_POKEMON,
      ), wantToUse => {
        if (wantToUse) {

          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false },
          ), selected => {
            if (!selected || selected.length === 0) {
              return state;
            }
            const target = selected[0];
            player.switchPokemon(target);
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const targetTags = [CardTag.POKEMON_V, CardTag.POKEMON_VSTAR, CardTag.POKEMON_VMAX, CardTag.POKEMON_ex];

      const damageTargets = [opponent.active, ...opponent.bench].filter(pokemon => {
        const card = pokemon.getPokemonCard();
        return card && targetTags.some(tag => card.tags.includes(tag));
      });

      damageTargets.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 100);
        damageEffect.target = target;
        effect.ignoreWeakness = true;
        effect.ignoreResistance = true;
        store.reduceEffect(state, damageEffect);
      });

      return state;
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
    }
    return state;
  }
}