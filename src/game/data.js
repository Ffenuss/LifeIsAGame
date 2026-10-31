// ---------------------------------------------------------------------------
// Life is a Game — static game content
// A board game that blends Monopoly-style ownership with The Game of Life's
// milestones, choices and the idea that money is not the only way to win.
// ---------------------------------------------------------------------------

export const CONFIG = {
  startingCash: 1500,
  baseSalary: 350,
  startingHappiness: 50,
  laps: 3,
  retirementBonus: 200,
  goalBonus: 300,
  upgradeCosts: [0.5, 0.8], // fraction of the property price, level 1 -> 2 -> 3
  groupRentMultiplier: 2,
  maxKids: 3,
};

export const DISTRICTS = {
  childhood: { name: 'Childhood', color: '#59C08A', dark: '#237B51', soft: '#DDF6E9' },
  career: { name: 'Career', color: '#5B8DEF', dark: '#2C56A8', soft: '#E0EAFF' },
  family: { name: 'Family', color: '#F08BAD', dark: '#A93B62', soft: '#FFE3EC' },
  adventure: { name: 'Adventure', color: '#A57BE0', dark: '#6842A8', soft: '#F0E5FF' },
  corner: { name: 'Milestone', color: '#F3B944', dark: '#8A5A00', soft: '#FFF1C9' },
};

export const PLAYER_STYLES = [
  { color: '#FF7A6B', dark: '#B8382D', light: '#FFD9D3', name: 'Coral' },
  { color: '#35C4B5', dark: '#0B7E74', light: '#D2F7F3', name: 'Teal' },
  { color: '#FFC44D', dark: '#9A6700', light: '#FFF0C7', name: 'Gold' },
  { color: '#9C7BF3', dark: '#5A38B5', light: '#E9DFFF', name: 'Violet' },
];

const P = (id, name, district, icon, price, rent) => ({
  id,
  name,
  district,
  icon,
  type: 'property',
  price,
  rent,
  blurb: `Own it and collect rent. Upgrade it to build your little empire.`,
});

export const TILES = [
  {
    id: 0,
    name: 'Fresh Start',
    type: 'start',
    district: 'corner',
    icon: 'sun',
    blurb: 'A new chapter begins. Pass by to collect your salary.',
  },
  P(1, 'Lemonade Stand', 'childhood', 'cup', 100, [12, 30, 55]),
  {
    id: 2,
    name: 'Playground',
    type: 'rest',
    district: 'childhood',
    icon: 'balloon',
    blurb: 'Take a breath, swing high, and enjoy the afternoon.',
    happiness: 5,
  },
  P(3, 'School Fair', 'childhood', 'balloon', 120, [15, 35, 65]),
  {
    id: 4,
    name: 'The Library',
    type: 'choice',
    district: 'childhood',
    icon: 'book',
    choiceId: 'library',
    blurb: 'A quiet afternoon and a world of books.',
  },
  P(5, 'Little League', 'childhood', 'ball', 140, [18, 40, 75]),
  {
    id: 6,
    name: 'Birthday Party',
    type: 'bonus',
    district: 'childhood',
    icon: 'gift',
    cash: 120,
    happiness: 6,
    blurb: 'Cake, friends, and a little envelope of birthday money.',
  },
  P(7, 'Toy Shop', 'childhood', 'blocks', 160, [20, 45, 85]),
  {
    id: 8,
    name: 'Graduation',
    type: 'choice',
    district: 'corner',
    icon: 'cap',
    choiceId: 'graduation',
    blurb: 'The world opens up. Which road will you take?',
  },
  P(9, 'First Job', 'career', 'briefcase', 200, [25, 55, 100]),
  P(10, 'Side Hustle', 'career', 'laptop', 180, [22, 50, 90]),
  P(11, 'Coffee Shop', 'career', 'coffee', 220, [28, 60, 110]),
  {
    id: 12,
    name: 'Promotion',
    type: 'bonus',
    district: 'career',
    icon: 'medal',
    cash: 150,
    salary: 60,
    happiness: 4,
    blurb: 'The boss noticed. A raise and a slightly nicer chair.',
  },
  P(13, 'Startup', 'career', 'rocket', 380, [45, 100, 185]),
  {
    id: 14,
    name: 'Night School',
    type: 'choice',
    district: 'career',
    icon: 'moon',
    choiceId: 'nightSchool',
    blurb: 'Trade a few evenings for a bigger tomorrow.',
  },
  P(15, 'Freelance Gig', 'career', 'laptop', 240, [30, 65, 120]),
  {
    id: 16,
    name: 'Midlife Crossroads',
    type: 'choice',
    district: 'corner',
    icon: 'compass',
    choiceId: 'midlife',
    blurb: 'Halfway there. Time to decide what the rest is for.',
  },
  {
    id: 17,
    name: 'First Date',
    type: 'event',
    district: 'family',
    icon: 'heart',
    blurb: 'Your heart does a little somersault.',
  },
  {
    id: 18,
    name: 'Wedding',
    type: 'choice',
    district: 'family',
    icon: 'rings',
    choiceId: 'wedding',
    blurb: 'Say yes to someone, or say yes to yourself.',
  },
  P(19, 'Starter Home', 'family', 'home', 300, [35, 80, 145]),
  {
    id: 20,
    name: 'Nursery',
    type: 'choice',
    district: 'family',
    icon: 'crib',
    choiceId: 'nursery',
    blurb: 'The spare room could become something more.',
  },
  P(21, 'Family Trip', 'family', 'plane', 200, [25, 55, 100]),
  P(22, 'Garden', 'family', 'flower', 180, [22, 50, 90]),
  P(23, 'Family Business', 'family', 'shop', 320, [40, 90, 160]),
  {
    id: 24,
    name: 'Empty Nest',
    type: 'emptyNest',
    district: 'corner',
    icon: 'nest',
    blurb: 'The house is quiet. The fridge is finally full.',
  },
  P(25, 'World Trip', 'adventure', 'globe', 260, [32, 70, 130]),
  P(26, 'Beach House', 'adventure', 'umbrella', 360, [44, 95, 175]),
  P(27, 'Mountain Cabin', 'adventure', 'mountain', 280, [34, 75, 140]),
  P(28, 'Art Studio', 'adventure', 'palette', 240, [30, 65, 120]),
  {
    id: 29,
    name: 'Stock Market',
    type: 'choice',
    district: 'adventure',
    icon: 'chart',
    choiceId: 'stocks',
    blurb: 'A little risk, a little reward, a lot of caffeine.',
  },
  {
    id: 30,
    name: 'Charity Gala',
    type: 'choice',
    district: 'adventure',
    icon: 'heart',
    choiceId: 'charity',
    blurb: 'A night of fancy clothes and bigger hearts.',
  },
  P(31, 'Dream Garage', 'adventure', 'car', 400, [48, 105, 195]),
];

export const PROPERTY_TILES = TILES.filter((t) => t.type === 'property');
export const TILE_BY_ID = Object.fromEntries(TILES.map((t) => [t.id, t]));
export const GROUP_TILES = TILES.reduce((groups, tile) => {
  if (tile.type !== 'property') return groups;
  (groups[tile.district] ||= []).push(tile.id);
  return groups;
}, {});

// ---------------------------------------------------------------------------
// Milestone choices — the Game of Life DNA
// ---------------------------------------------------------------------------

export const CHOICES = {
  library: {
    id: 'library',
    title: 'The Library',
    icon: 'book',
    prompt: 'You have a free afternoon and a library card. What do you do?',
    options: [
      {
        id: 'read',
        label: 'Read for the joy of it',
        detail: '+8 happiness',
        effects: { happiness: 8 },
        ai: 2,
      },
      {
        id: 'study',
        label: 'Study for a certificate',
        detail: '−$80 · +$25 salary · +3 happiness',
        cost: 80,
        effects: { cash: -80, salary: 25, happiness: 3 },
        ai: 3,
      },
    ],
  },
  graduation: {
    id: 'graduation',
    title: 'Graduation Day',
    icon: 'cap',
    prompt: 'The cap is in the air. What comes next?',
    options: [
      {
        id: 'college',
        label: 'Go to college',
        detail: '−$400 · +$120 salary · +6 happiness',
        cost: 400,
        effects: { cash: -400, salary: 120, happiness: 6, flags: ['scholar'] },
        ai: 4,
      },
      {
        id: 'trade',
        label: 'Trade school',
        detail: '−$150 · +$70 salary · +2 happiness',
        cost: 150,
        effects: { cash: -150, salary: 70, happiness: 2 },
        ai: 3,
      },
      {
        id: 'work',
        label: 'Start working right away',
        detail: '+$200 · +$25 salary',
        effects: { cash: 200, salary: 25 },
        ai: 2,
      },
    ],
  },
  nightSchool: {
    id: 'nightSchool',
    title: 'Night School',
    icon: 'moon',
    prompt: 'A course could change your career. It also costs money and sleep.',
    options: [
      {
        id: 'enroll',
        label: 'Enroll in the course',
        detail: '−$250 · +$90 salary · +4 happiness',
        cost: 250,
        effects: { cash: -250, salary: 90, happiness: 4, flags: ['scholar'] },
        ai: 4,
      },
      {
        id: 'skip',
        label: 'Keep your evenings',
        detail: '+2 happiness',
        effects: { happiness: 2 },
        ai: 1,
      },
    ],
  },
  midlife: {
    id: 'midlife',
    title: 'Midlife Crossroads',
    icon: 'compass',
    prompt: 'You have built a life. Now what is it for?',
    options: [
      {
        id: 'dream',
        label: 'Chase the dream',
        detail: '−$150 · −$40 salary · +20 happiness',
        cost: 150,
        effects: { cash: -150, salary: -40, happiness: 20, flags: ['dreamer'] },
        ai: 3,
      },
      {
        id: 'career',
        label: 'Double down on your career',
        detail: '+$90 salary · −6 happiness',
        effects: { salary: 90, happiness: -6 },
        ai: 4,
      },
      {
        id: 'investSelf',
        label: 'Invest in yourself',
        detail: '−$200 · +$40 salary · +10 happiness',
        cost: 200,
        effects: { cash: -200, salary: 40, happiness: 10 },
        ai: 3,
      },
    ],
  },
  wedding: {
    id: 'wedding',
    title: 'Wedding Bells',
    icon: 'rings',
    prompt: 'Someone wonderful is standing in front of you. What do you say?',
    options: [
      {
        id: 'marry',
        label: 'Say “I do”',
        detail: '−$300 · +15 happiness · +$40 salary',
        cost: 300,
        effects: { cash: -300, happiness: 15, salary: 40, partner: true },
        ai: 4,
      },
      {
        id: 'later',
        label: 'Not yet',
        detail: '+2 happiness',
        effects: { happiness: 2 },
        ai: 1,
      },
    ],
  },
  nursery: {
    id: 'nursery',
    title: 'The Nursery',
    icon: 'crib',
    prompt: 'The spare room is quiet and full of possibility.',
    options: [
      {
        id: 'baby',
        label: 'Start a family',
        detail: '−$200 · +12 happiness · +1 kid',
        cost: 200,
        effects: { cash: -200, happiness: 12, kids: 1, salary: -20 },
        ai: 4,
      },
      {
        id: 'later',
        label: 'Not right now',
        detail: '+2 happiness',
        effects: { happiness: 2 },
        ai: 1,
      },
    ],
  },
  stocks: {
    id: 'stocks',
    title: 'Stock Market',
    icon: 'chart',
    prompt: 'A hot tip, a shaky chart, and a decision to make.',
    options: [
      {
        id: 'invest',
        label: 'Invest $200',
        detail: '55% chance: +$600 · 45% chance: lose it',
        cost: 200,
        effects: { cash: -200 },
        gamble: { chance: 0.55, win: 600, winText: 'The stock soared!', loseText: 'The stock tanked.' },
        ai: 3,
      },
      {
        id: 'safe',
        label: 'Play it safe',
        detail: '+4 happiness',
        effects: { happiness: 4 },
        ai: 1,
      },
    ],
  },
  charity: {
    id: 'charity',
    title: 'Charity Gala',
    icon: 'heart',
    prompt: 'A beautiful evening for a good cause. Your wallet is listening.',
    options: [
      {
        id: 'donate',
        label: 'Make a generous donation',
        detail: '−$200 · +20 happiness · Big Heart',
        cost: 200,
        effects: { cash: -200, happiness: 20, flags: ['philanthropist'] },
        ai: 3,
      },
      {
        id: 'keep',
        label: 'Just enjoy the canapés',
        detail: '−3 happiness',
        effects: { happiness: -3 },
        ai: 1,
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Life happens — the event deck
// ---------------------------------------------------------------------------

export const CARDS = [
  { id: 'sidewalk', title: 'Lucky Find', icon: 'coin', tone: 'good', text: 'You find $50 folded into an old coat pocket.', cash: 50 },
  { id: 'medical', title: 'Surprise Bill', icon: 'heart', tone: 'bad', text: 'A trip to the dentist costs more than expected.', cash: -150 },
  { id: 'sideproject', title: 'Side Project Soars', icon: 'rocket', tone: 'good', text: 'Your weekend project finds its first 1,000 customers.', cash: 300 },
  { id: 'car', title: 'Car Trouble', icon: 'car', tone: 'bad', text: 'The mechanic makes a sympathetic face. That is never good.', cash: -120 },
  { id: 'loan', title: 'Old Favour Repaid', icon: 'coin', tone: 'good', text: 'A friend finally pays back that loan from years ago.', cash: 100 },
  { id: 'puppy', title: 'A Very Good Dog', icon: 'heart', tone: 'good', text: 'You adopt a puppy. Your budget and your heart disagree.', cash: -80, happiness: 10 },
  { id: 'promo', title: 'Quiet Promotion', icon: 'medal', tone: 'good', text: 'Your work speaks for itself. A raise arrives.', cash: 120, salary: 50 },
  { id: 'refund', title: 'Tax Refund', icon: 'coin', tone: 'good', text: 'The government sends a small, beautiful surprise.', cash: 180 },
  { id: 'vacation', title: 'Dream Vacation', icon: 'plane', tone: 'good', text: 'You book the trip. The photos are worth every penny.', cash: -200, happiness: 15 },
  { id: 'inheritance', title: 'A Distant Relative', icon: 'gift', tone: 'good', text: 'A generous inheritance arrives out of the blue.', cash: 400 },
  { id: 'repair', title: 'Home Repair', icon: 'home', tone: 'bad', text: 'The roof has opinions about the weather.', cash: -100 },
  { id: 'raffle', title: 'Raffle Winner', icon: 'star', tone: 'good', text: 'You win the school raffle. The kids are thrilled.', cash: 250 },
  { id: 'burnout', title: 'Burnout', icon: 'moon', tone: 'bad', text: 'You take an unpaid week to recharge. It helps.', cash: -50, happiness: -10 },
  { id: 'mentor', title: 'Pay It Forward', icon: 'book', tone: 'good', text: 'You mentor a student. They send you a thank-you note.', cash: 50, happiness: 8 },
  { id: 'dividend', title: 'Dividend Day', icon: 'chart', tone: 'good', text: 'Your investments quietly pay you for existing.', cash: 120 },
  { id: 'market', title: 'Market Wobble', icon: 'chart', tone: 'bad', text: 'The market sneezes. Your portfolio catches a cold.', cash: -90 },
];

// ---------------------------------------------------------------------------
// Life goals — secret ambitions scored at the end
// ---------------------------------------------------------------------------

export const GOALS = [
  {
    id: 'tycoon',
    name: 'Tycoon',
    icon: 'briefcase',
    desc: 'Own 4 or more assets when the game ends.',
    check: (state, player) => countAssets(state, player.id) >= 4,
  },
  {
    id: 'globetrotter',
    name: 'Globetrotter',
    icon: 'globe',
    desc: 'Own 2 adventure properties when the game ends.',
    check: (state, player) =>
      countAssets(state, player.id, (tile) => tile.district === 'adventure') >= 2,
  },
  {
    id: 'family',
    name: 'Family First',
    icon: 'heart',
    desc: 'Find a partner and raise 2 children.',
    check: (_state, player) => player.partner && player.kids >= 2,
  },
  {
    id: 'scholar',
    name: 'Scholar',
    icon: 'cap',
    desc: 'Complete college or night school.',
    check: (_state, player) => Boolean(player.flags.scholar),
  },
  {
    id: 'philanthropist',
    name: 'Big Heart',
    icon: 'heart',
    desc: 'Make a generous donation at the Charity Gala.',
    check: (_state, player) => Boolean(player.flags.philanthropist),
  },
  {
    id: 'homeowner',
    name: 'Dream Home',
    icon: 'home',
    desc: 'Fully upgrade any property to level 3.',
    check: (state, player) => hasMaxLevelAsset(state, player.id),
  },
  {
    id: 'socialite',
    name: 'Joy Seeker',
    icon: 'star',
    desc: 'Reach 80 happiness when the game ends.',
    check: (_state, player) => player.happiness >= 80,
  },
  {
    id: 'investor',
    name: 'Nest Egg',
    icon: 'coin',
    desc: 'Finish with at least $2,000 in cash.',
    check: (_state, player) => player.cash >= 2000,
  },
];

export const GOAL_BY_ID = Object.fromEntries(GOALS.map((goal) => [goal.id, goal]));

export function countAssets(state, playerId, filter = () => true) {
  return Object.entries(state.owners).filter(([tileId, own]) => {
    return own.owner === playerId && filter(TILE_BY_ID[Number(tileId)]);
  }).length;
}

export function hasMaxLevelAsset(state, playerId) {
  return Object.values(state.owners).some((own) => own.owner === playerId && own.level >= 3);
}

export function ownsGroup(state, playerId, district) {
  const ids = GROUP_TILES[district] || [];
  return ids.length > 0 && ids.every((id) => state.owners[id]?.owner === playerId);
}

export function rentFor(state, tileId) {
  const tile = TILE_BY_ID[tileId];
  const own = state.owners[tileId];
  if (!tile || !own) return 0;
  const base = tile.rent[own.level - 1] || tile.rent[0];
  return ownsGroup(state, own.owner, tile.district) ? base * CONFIG.groupRentMultiplier : base;
}

export function upgradeCost(tile, level) {
  return Math.round((tile.price * CONFIG.upgradeCosts[level - 1]) / 10) * 10;
}

export function assetValue(tile, level) {
  return Math.round(tile.price * [0, 0.7, 0.85, 1][level]);
}

export const RULES = [
  {
    icon: 'star',
    title: 'Build a life',
    text: 'Travel the board through Childhood, Career, Family and Adventure. Pass Fresh Start to collect your salary and begin a new chapter.',
  },
  {
    icon: 'home',
    title: 'Own your story',
    text: 'Land on an unowned property to buy it. Land on your own property to upgrade it. Land on someone else’s to pay rent — owning a full colour group doubles it.',
  },
  {
    icon: 'compass',
    title: 'Make choices',
    text: 'Milestones like Graduation, Wedding and Midlife ask you to choose. There is no single right answer — every path has a price and a payoff.',
  },
  {
    icon: 'heart',
    title: 'Win at life',
    text: 'After the final chapter, your score combines cash, assets, happiness, family, your secret life goal and retirement. Money alone rarely wins.',
  },
];
