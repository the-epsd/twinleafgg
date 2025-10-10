// Mock data for UI showcase component - PTCG Elite Design System

export const MOCK_FORMATS = [
  {
    value: 'standard',
    label: 'Standard',
    deckName: 'Lugia VSTAR',
    queueCount: 12,
    archetype: 'lugia'
  },
  {
    value: 'standard_nightly',
    label: 'Standard Nightly',
    deckName: 'Mew VMAX',
    queueCount: 8,
    archetype: 'mew'
  },
  {
    value: 'expanded',
    label: 'Expanded',
    deckName: 'Pikachu & Zekrom',
    queueCount: 5,
    archetype: 'pikachu'
  },
  {
    value: 'glc',
    label: 'GLC',
    deckName: 'Lost Box',
    queueCount: 3,
    archetype: 'lost'
  }
];

export const MOCK_DECKS = [
  {
    id: '1',
    name: 'Lugia VSTAR Control',
    isValid: true,
    archetype: 'lugia',
    format: ['standard'],
    isDefault: true
  },
  {
    id: '2',
    name: 'Mew VMAX Fusion Strike',
    isValid: true,
    archetype: 'mew',
    format: ['standard', 'standard_nightly'],
    isDefault: false
  },
  {
    id: '3',
    name: 'Pikachu & Zekrom Tag Team',
    isValid: false,
    archetype: 'pikachu',
    format: ['expanded'],
    isDefault: false
  },
  {
    id: '4',
    name: 'Lost Box Toolbox',
    isValid: true,
    archetype: 'lost',
    format: ['glc'],
    isDefault: false
  }
];

export const MOCK_FRIENDS = [
  {
    userId: '1',
    name: 'Ash Ketchum',
    avatarFile: 'av_1.png',
    ranking: 1250,
    connected: true,
    status: 'accepted',
    lastBattle: '2 days ago',
    winRate: '67%'
  },
  {
    userId: '2',
    name: 'Misty',
    avatarFile: 'av_2.png',
    ranking: 1180,
    connected: false,
    status: 'accepted',
    lastBattle: '1 week ago',
    winRate: '72%'
  },
  {
    userId: '3',
    name: 'Brock',
    avatarFile: 'av_3.png',
    ranking: 1320,
    connected: true,
    status: 'blocked',
    lastBattle: '3 days ago',
    winRate: '81%'
  },
  {
    userId: '4',
    name: 'Gary Oak',
    avatarFile: 'av_4.png',
    ranking: 1100,
    connected: true,
    status: 'accepted',
    lastBattle: '1 day ago',
    winRate: '68%'
  }
];

export const MOCK_FORM_DATA = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  rememberMe: true,
  receiverId: '12345',
  bio: 'This is a sample bio for testing purposes.'
};

export const MOCK_ARCHETYPES = [
  'lugia', 'mew', 'pikachu', 'lost', 'control', 'aggro', 'midrange', 'combo'
];

export const MOCK_ENERGY_TYPES = [
  'Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Fairy', 'Dragon'
];

export const MOCK_TRAINER_TYPES = [
  'Supporter', 'Item', 'Stadium', 'Tool', 'Pokemon Tool'
];

export const MOCK_LOADING_STATES = {
  spinner: true,
  overlay: false,
  button: false
};

export const MOCK_STATUS_INDICATORS = {
  online: true,
  offline: false,
  queue: 12,
  valid: true,
  invalid: false
};
