import { authService } from './auth.service';
import { ApiError } from './api.error';
import { ApiErrorEnum } from './api.error.enum';

export enum CardTag {
  POKEMON_SP = 'SP',
  POKEMON_EX = 'EX',
  POKEMON_GX = 'GX',
  POKEMON_LV_X = 'LV_X',
  POKEMON_V = 'V',
  POKEMON_VMAX = 'VMAX',
  POKEMON_VSTAR = 'VSTAR',
  POKEMON_VUNION = 'VUNION',
  ACE_SPEC = 'ACE_SPEC',
  RADIANT = 'RADIANT',
  ROCKETS_SECRET_MACHINE = 'ROCKETS_SECRET_MACHINE',
  TEAM_PLASMA = 'TEAM_PLASMA',
  FUSION_STRIKE = 'FUSION_STRIKE',
  SINGLE_STRIKE = 'SINGLE_STRIKE',
  RAPID_STRIKE = 'RAPID_STRIKE',
  POKEMON_ex = 'ex',
  FUTURE = 'Future',
  ANCIENT = 'Ancient',
  POKEMON_TERA = 'POKEMON_TERA',
  ULTRA_BEAST = 'ULTRA_BEAST',
  TAG_TEAM = 'TAG_TEAM',
  TEAM_MAGMA = 'TEAM_MAGMA',
  PRISM_STAR = 'PRISM_STAR',
  BREAK = 'BREAK',
  PRIME = 'PRIME',
  HOLO = 'HOLO',
  LEGEND = 'LEGEND',
  DUAL_LEGEND = 'DUAL_LEGEND',
  TEAM_FLARE = 'TEAM_FLARE',
  MEGA = 'MEGA',
  PLAY_DURING_SETUP = 'PLAY_DURING_SETUP',
  DELTA_SPECIES = 'DELTA_SPECIES',
  DARK = 'DARK',
  LILLIES = 'LILLIES',
  NS = 'NS',
  IONOS = 'IONOS',
  HOPS = 'HOPS',
  MARNIES = 'MARNIES',
  STEVENS = 'STEVENS',
  ETHANS = 'ETHANS',
  MISTYS = 'MISTYS',
  CYNTHIAS = 'CYNTHIAS',
  ARVENS = 'ARVENS',
  POKEMON_SV_MEGA = 'POKEMON_SV_MEGA',
  HOLONS = 'HOLONS',
  TEAM_ROCKET = 'TEAM_ROCKET',
}

export enum SuperType {
  NONE,
  POKEMON,
  TRAINER,
  ENERGY,
  ANY
}

export enum EnergyType {
  BASIC,
  SPECIAL,
}

export enum TrainerType {
  ITEM,
  SUPPORTER,
  STADIUM,
  TOOL,
}

export enum PokemonType {
  NORMAL,
  EX,
  LEGEND,
}

export enum Stage {
  NONE,
  RESTORED,
  BASIC,
  STAGE_1,
  STAGE_2,
  VMAX,
  VSTAR,
  VUNION,
  LEGEND,
  MEGA,
  BREAK,
}

export enum CardType {
  ANY,
  GRASS,
  FIRE,
  WATER,
  LIGHTNING,
  PSYCHIC,
  FIGHTING,
  DARK,
  METAL,
  COLORLESS,
  FAIRY,
  DRAGON,
  NONE,
  CHARIZARD_EX,
  PIDGEOT_EX,
  GIRATINA_VSTAR,
  ARCEUS_VSTAR,
  COMFEY,
  SABLEYE,
  RAGING_BOLT_EX,
  SOLROCK,
  LUNATONE,
  KYUREM_VMAX,
  MURKROW,
  FLAMIGO,
  CHIEN_PAO_EX,
  BAXCALIBUR,
  SNORLAX_STALL,
  LUGIA_VSTAR,
  ABSOL_EX,
  THWACKEY,
  DIPPLIN,
  PALKIA_VSTAR,
  ROTOM_V,
  BIBAREL,
  GHOLDENGO_EX,
  SANDY_SHOCKS_EX,
  GARDEVOIR_EX,
  XATU,
  TEALMASK_OGERPON_EX,
  LUXRAY_EX,
  GRENINJA_EX,
  BLISSEY_EX,
  ROARING_MOON,
  KORAIDON,
  IRON_CROWN_EX,
  CINCCINO,
  ARCHEOPS,
  MIRAIDON_EX,
  IRON_HANDS_EX,
  DRAGAPULT_EX,
  DRIFLOON,
  FROSLASS,
  WLFM,
  GRW,
  LPM,
  FDY,
  GRPD
}

export enum Format {
  NONE,
  STANDARD,
  EXPANDED,
  UNLIMITED,
  RETRO,
  GLC,
  STANDARD_NIGHTLY,
  BW,
  XY,
  SM,
  SWSH,
  SV,
  WORLDS_2013,
}

export interface Weakness {
  type: CardType;
  value?: number;
}

export interface Resistance {
  type: CardType;
  value: number;
}

export interface Attack {
  cost: CardType[];
  damage: number;
  damageCalculation?: string;
  copycatAttack?: boolean;
  gxAttack?: boolean;
  shredAttack?: boolean;
  useOnBench?: boolean;
  canUseOnFirstTurn?: boolean;
  name: string;
  text: string;
  effect?: (store: any, state: any, effect: any) => void;
}

export interface Power {
  name: string;
  powerType: string;
  text: string;
  effect?: (store: any, state: any, effect: any) => any;
  useWhenInPlay?: boolean;
  useFromHand?: boolean;
  useFromDiscard?: boolean;
  exemptFromAbilityLock?: boolean;
  exemptFromInitialize?: boolean;
  barrage?: boolean;
}

export interface Card {
  id: number;
  name: string;
  fullName: string;
  superType: SuperType;
  cardType?: CardType;
  additionalCardTypes?: CardType[];
  cardTag?: CardTag[];
  pokemonType?: PokemonType;
  evolvesFrom?: string;
  stage?: Stage;
  retreat?: CardType[];
  hp?: number;
  weakness?: Weakness[];
  resistance?: Resistance[];
  powers?: Power[];
  attacks?: Attack[];
  format?: Format;
  regulationMark?: string;
  energyType?: EnergyType;
  trainerType?: TrainerType;
  // EnergyCard properties
  provides?: CardType[];
  text?: string;
  isBlocked?: boolean;
  blendedEnergies?: CardType[];
  energyEffect?: any;
  // TrainerCard properties
  firstTurn?: boolean;
  stadiumDirection?: 'up' | 'down';
  toolEffect?: any;
  // Common properties
  set: string;
  setNumber: string;
  tags: CardTag[];
  cardImage: string;
}

export interface CardListResponse {
  ok: boolean;
  cards: Card[];
}

export class CardService {
  private static instance: CardService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = `${process.env.REACT_APP_API_URL}/v1/cards`;
  }

  public static getInstance(): CardService {
    if (!CardService.instance) {
      CardService.instance = new CardService();
    }
    return CardService.instance;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = authService.getToken();
    if (!token) {
      throw new ApiError(ApiErrorEnum.AUTH_ERROR, 'Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Auth-Token': token,
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(ApiErrorEnum.API_ERROR, error.error || 'API request failed');
    }

    return response.json();
  }

  public async getAllCards(): Promise<CardListResponse> {
    return this.fetch('/all');
  }

  public async getCard(cardId: string): Promise<Card> {
    // The cardId should be in the format "SET NUMBER"
    const [set, setNumber] = cardId.split(' ');
    if (!set || !setNumber) {
      throw new ApiError(ApiErrorEnum.API_ERROR, 'Invalid card ID format');
    }
    return this.fetch<Card>(`/${set}/${setNumber}`);
  }
}

export const cardService = CardService.getInstance();