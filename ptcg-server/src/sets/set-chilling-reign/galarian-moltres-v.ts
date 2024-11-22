import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, PowerType, GameError, EnergyCard } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class GalarianMoltresV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.DARK;

  public tags = [ CardTag.POKEMON_V ];

  public hp: number = 220;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [
    {
      name: 'Direflame Wings',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, you may attach a [D] Energy card from your discard pile to this Pokémon. You can\'t use more than 1 Direflame Wings Ability each turn.'
    }
  ];

  public attacks = [
    {
      name: 'Aura Burn',
      cost: [ CardType.DARK, CardType.DARK, CardType.COLORLESS ],
      damage: 190,
      text: 'This Pokémon also does 30 damage to itself.'
    }
  ];

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '97';

  public name: string = 'Galarian Moltres V';

  public fullName: string = 'Galarian Moltres V CRE 97';

  public readonly DIREFLAME_WINGS_MARKER = 'DIREFLAME_WINGS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DIREFLAME_WINGS_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.DIREFLAME_WINGS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.DARK);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined) {
        return state;
      }
      

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        player.discard,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Darkness Energy' },
        { min: 0, max: 1, allowCancel: true }
      ), cards => {
        cards = cards || [];
        if (cards.length > 0) {
          player.marker.addMarker(this.DIREFLAME_WINGS_MARKER, this);
          player.discard.moveCardsTo(cards, cardList);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.DIREFLAME_WINGS_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
    
      const dealDamage = new DealDamageEffect(effect, 30);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }
    
    return state;
  }
    
}