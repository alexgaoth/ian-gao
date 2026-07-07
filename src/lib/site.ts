export const SITE = {
  url: 'https://ian-gao.com',
  name: 'Ian Gao',
  legalName: 'Tianyi Gao',
  titleSuffix: 'Ian Gao',
  email: 'iangao0903@gmail.com',
  school: 'Leland High School',
  locality: 'San Jose, California',
  description:
    "Ian Gao is a senior at Leland High School — president of Leland Speech and Debate, ranked 19th nationally in Lincoln-Douglas, with research at CCIR, UC Santa Barbara, and UC Santa Cruz, and campaign work for Matt Mahan and Evan Low.",
  // Populate once real profile URLs exist (LinkedIn, school debate page, etc.) — see DEPLOYMENT.md open items.
  sameAs: [] as string[],
} as const;

export function pageTitle(title: string, opts: { homepage?: boolean } = {}) {
  if (opts.homepage) return title;
  return `${title} — ${SITE.titleSuffix}`;
}
