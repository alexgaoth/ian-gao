/*
  "What I believe" — from Ian's review notes:
    'I want to add more "what i believe in" rather than what i am'

  These must be Ian's OWN words. Nothing is written here on his behalf, and nothing is
  invented — an empty array is the honest state until he supplies the text. The homepage
  section renders only when this array is non-empty, so the site never ships a hollow
  "coming soon" block.

  To fill it in, add entries like:
    { claim: 'The strongest case is the one that has already survived its best objection.',
      body:  'One or two sentences in Ian’s voice on why.' }

  `body` is optional — a list of bare claims works too.
*/

export interface Belief {
  claim: string;
  body?: string;
}

export const beliefs: Belief[] = [];
