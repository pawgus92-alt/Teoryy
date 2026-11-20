export interface EnglishTheory {
  title: string
  summary: string
  body: string
  tags: string[]
}

export const THEORY_EN: Record<string, EnglishTheory> = {
  'th-quantum': {
    title: 'Quantum entanglement will someday replace radio',
    summary:
      'Correlation between entangled particles does not by itself send a signal. The claim is that an engineering workaround to the no-communication theorem will still appear and make long-distance links instantaneous.',
    body: 'The no-communication theorem says a local measurement on one half of an entangled pair cannot deliver a chosen message faster than light. Any attempt to “modulate” your particle destroys the correlation before the other side can read it.\n\nSupporters answer that the ban covers an ideal channel with no shared resource. If you distribute a huge stock of entangled pairs in advance and learn to refresh them in flight, the practical delay could fall below any radio link between Mars and Earth. For now it is an engineering wish: decoherence eats the pairs faster than they can be delivered.\n\nThe test is simple and strict. The receiver must read a message that was not agreed in advance, sooner than light can carry the same information. Until that experiment exists, the theory stays open.',
    tags: ['quanta', 'communication', 'physics'],
  },
  'th-simulation': {
    title: 'The observable universe is a computer simulation',
    summary:
      'If civilizations survive long enough to run ancestor simulations, most observers should live inside a model rather than in base reality. The question is whether such a model leaves a testable trace.',
    body: 'Bostrom’s argument splits three ways: civilizations die before they can simulate, they are forbidden to run simulations, or we are already almost certainly inside one. This theory takes the third branch and adds an empirical promise: a simulation has finite resolution, and a grid should show up at the Planck scale or in cosmic rays at extreme energies.\n\nCritics rightly note that “living inside a computation” does not have to look like pixels. A simulation can be continuous to its inhabitants. Then the theory cannot be falsified and stops being science.\n\nSo the claim here is narrow. It comes true only if a repeatable limit appears that looks like a discretization artifact and cannot be explained by known physics. No such limit has been found, so the status stays an open argument.',
    tags: ['simulation', 'philosophy', 'cosmos'],
  },
  'th-agi': {
    title: 'General artificial intelligence will arrive before 2030',
    summary:
      'Systems that reliably solve new tasks at the level of a strong specialist, without narrow fine-tuning, will exist before the decade ends. This is not a chat window. It is independent work over a long horizon.',
    body: 'In a few years models went from plausible text completion to agents that write code, plan experiments, and use tools. The theory says the remaining gap — reliability on long tasks, memory, and checking their own mistakes — will close before 2030.\n\nSkeptics point out that benchmarks saturate faster than the ability to work for a week without a human. Economic “general intelligence” is not a high score. It is replacing a team in an unfamiliar field at a known cost of error.\n\nThe fulfillment test: a public system that, without special extra training, takes a month of real research or engineering work and brings it to a checkable result. A demo on a test that was published in advance does not count.',
    tags: ['ai', 'agents', '2030'],
  },
  'th-mars': {
    title: 'A permanent inhabited base will stand on Mars by 2040',
    summary:
      'By 2040 Mars will have a station where crews rotate instead of flying a single expedition, and where air, water, and at least some food are produced on site.',
    body: 'One-off landings are already discussed as engineering projects, not fantasy. This theory is stronger: a base that does not die after the first crew leaves. That needs local fuel, a closed water loop, and radiation shielding, not only a flag in the dust.\n\nThe bottleneck is not the rocket. It is failure logistics. With a half-year radio lag, every broken pump must be fixed with what is already on the pad. Earth analogues in deserts still live on constant resupply.\n\nFulfillment is recorded when a station stays inhabited for more than one Martian year and covers at least half of its water and oxygen use with local systems.',
    tags: ['mars', 'space', 'colony'],
  },
  'th-wastewater': {
    title: 'Wastewater analysis will warn of a pandemic before clinics do',
    summary:
      'A city’s sewers will show a pathogen rising days or weeks before the wave of clinic visits. The theory promised an operational system, not a one-off scientific chart.',
    body: 'Viruses and bacteria reach the drain before a person decides to see a doctor. If samples are taken at the treatment plant every day and compared with hospital statistics, a spike in the pipe should lead the spike in the waiting room.\n\nBy the middle of the decade such programs stopped being papers and became a routine public-health tool: wastewater caught waves of respiratory viruses and bed plans were adjusted before the official case counts rose.\n\nThe theory is marked fulfilled not because the sewer replaced the clinic, but because in several countries the signal from the drain really arrived before the clinical report and decisions were based on it.',
    tags: ['epidemiology', 'data', 'health'],
  },
  'th-fusion': {
    title: 'Cold nuclear fusion can be started on a tabletop',
    summary:
      'Electrolysis of palladium in heavy water was said to produce excess heat of nuclear origin without plasma or giant machines. A repeatable experiment never appeared.',
    body: 'The promise of cold fusion was temptingly simple: take a palladium cathode and heavy water and get heat that chemistry cannot explain. Early reports spoke of bursts, neutrons, and even helium.\n\nIndependent labs spent decades trying to repeat the effect under the same conditions. Excess heat vanished or turned out to be a calorimetry error, and the nuclear products did not match the claimed energy. The scientific consensus reduced the original runs to measurement artifacts.\n\nThe theory is refuted in the narrow wording “a Fleischmann and Pons tabletop cell produces nuclear fusion.” Hot fusion in tokamaks is a different story and is not closed by this card.',
    tags: ['fusion', 'experiment', 'energy'],
  },
  'th-bitcoin': {
    title: 'Bitcoin will replace fiat as everyday money by 2025',
    summary:
      'By 2025 wages, rent, and groceries in several large economies were supposed to be priced in bitcoin more often than in the national currency. That did not happen.',
    body: 'The forecast rested on a capped supply and distrust of central banks. If people save in bitcoin, the next step is paying for bread with it. The theory set a deadline: by 2025 everyday prices in at least one G20 economy are listed in bitcoin more often than in fiat.\n\nBy the deadline bitcoin remained an asset and a speculative rail, not the unit of account in a shop. Fees, volatility, and taxes made a cup of coffee awkward. States answered with tight rules or with their own digital currencies.\n\nThe date passed and the test failed. The card is closed as refuted, even though the asset itself is still here.',
    tags: ['bitcoin', 'money', '2025'],
  },
  'th-social': {
    title: 'Social networks will break into closed circles of interest',
    summary:
      'One public feed for everyone will give way to small rooms: chats, newsletters, and communities you enter by invitation rather than by an engagement algorithm.',
    body: 'An open feed optimizes attention and therefore inflates conflict. The theory said people would tire of the town square and move the conversation into rooms of tens and hundreds: closed channels, paid circles, group chats with a purpose.\n\nBy 2025 this was no longer a taste of early users. Large platforms added private spaces themselves, and a visible share of discussion moved into newsletters and messengers with no public like counter. The public feed remains, but it is no longer the only place where the conversation happens.\n\nFulfillment counts a shift in habit, not the death of big networks. They are alive. They just no longer hold the whole conversation in one square.',
    tags: ['networks', 'communities', 'media'],
  },
  'th-ubi': {
    title: 'A universal basic income will become standing policy in several countries',
    summary:
      'At least three countries will pay every adult resident indefinitely, with no means test, and publish it as a permanent law rather than a pilot.',
    body: 'Basic-income pilots have already measured employment, health, and spending on small samples. This theory is about a different scale: the payment becomes as permanent as a pension, covers every adult, and does not end with the grant.\n\nThe political barrier is not the pilot data. It is the budget and the choice of whom to exclude. Governments still prefer to narrow targeted aid rather than give it to everyone. Supporters expect automation of the labor market to make means tests more expensive than the payment itself.\n\nThe test is deliberately strict: three countries, every adult resident, a law with no end date, and no income test. One city experiment does not close the theory.',
    tags: ['ubi', 'politics', 'labor'],
  },
  'th-quiet': {
    title: 'Major platforms will offer a feed with no recommendation algorithm',
    summary:
      'At least two platforms with hundreds of millions of users will give a permanent switch: a chronological subscription feed with no recommendations, and the setting will stick.',
    body: 'A recommendation feed increases session time and, at the same time, fatigue. The theory said regulators or competition itself would force platforms to leave an honest off switch: only the accounts you follow, in posting order, with no “you might like.”\n\nBy early 2026 that mode was no longer a hidden experiment flag. Large services put a chronological feed in the permanent settings, and the choice was not reset on the next visit. It did not make recommendations the non-default, but it made refusing them one tap instead of a fight with the interface.\n\nFulfillment was marked on 20 January 2026: the test of two large platforms and a setting that persists was met.',
    tags: ['feed', 'algorithms', 'interface'],
  },
}

export const COMMENT_EN: Record<string, string> = {
  'c-q1':
    'The no-communication theorem is not a technical limit. It follows from the linearity of quantum mechanics. A workaround would need new physics, not a better laser.',
  'c-q1r':
    'Agreed that a “better laser” will not help. I want to know whether a workaround is hiding in a pre-shared entangled resource plus a classical error-correcting code.',
  'c-q2':
    'Even if the channel stays classical, a network of quantum repeaters already changes cryptography. Do not mix that up with instantaneous communication.',
  'c-s1':
    'This is a convenient story because you cannot catch it. Any negative result can be declared part of the script.',
  'c-s1r':
    'That is why the text states a criterion: it has to be a discretization artifact, not “a feeling that the world is strange.”',
  'c-s2':
    'Even if the argument is statistically right, it says nothing about how to live or which experiment to run tomorrow.',
  'c-s2r':
    'It does show the boundary: a beautiful probability with no observable trace stays literature.',
  'c-s3':
    'Cosmic rays above the GZK cutoff were exactly the candidate for “pixels.” So far the data are explained without a simulation.',
  'c-a1':
    'If the test is a month of autonomous work, 2030 looks tight. Agents still lose the goal on day two.',
  'c-a2':
    'I care who judges a “checkable result.” Otherwise every lab will declare victory on its own internal report.',
  'c-a2r':
    'Agreed. The test should add an independent client who never saw the system while it was trained on that task.',
  'c-m1':
    '2040 is two cycles of heavy ships. Without a working methane plant on the planet itself, the date slides right.',
  'c-m2':
    'I would count “permanent” and “staffed by a shift” separately. A three-month shift is not yet a base.',
  'c-w1':
    'What matters is that the method did not predict “a new pandemic in general.” It gave a local early signal. That is an honest, narrow fulfillment.',
  'c-w2':
    'In small towns without proper treatment plants the method is blind. Fulfillment should be marked as urban, not planetary.',
  'c-f1':
    'It is useful to keep this card next to living hypotheses: “refuted” is also a result, not a failure of the log.',
  'c-f2':
    'Every new “breakthrough in a jar” should be checked against this test: an independent repeat and a balance of nuclear products.',
  'c-b1':
    'Some supporters later narrowed the claim to “a reserve asset.” That is a different theory and should be filed separately.',
  'c-b1r':
    'Yes. I am leaving the original wording so the deadline cannot be quietly rewritten.',
  'c-b2':
    'El Salvador is often offered as a counterexample, but everyday turnover there did not move to bitcoin in the sense written above.',
  'c-so1':
    'Closed circles easily become echo chambers. A habit coming true does not mean it is better.',
  'c-so2':
    'A good example of how to record a social theory: not “everyone felt cozy,” but an observable move of the conversation.',
  'c-u1':
    'It is worth deciding in advance whether a territory with partial sovereignty counts as a country. Otherwise any island pilot gets credit.',
  'c-y1':
    'The switch exists, but the start screen is still recommended. That was enough for the test, and the card says so honestly.',
  'c-y1r':
    'Yes. I did not promise the mode would become the default. Otherwise the theory would be about regulation, not about having a choice.',
  'c-y2':
    'It will be worth watching whether they hide the toggle again when session time drops. Fulfillment can be reconsidered.',
}
