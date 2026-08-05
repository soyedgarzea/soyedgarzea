export type Locale = 'es' | 'en';

export type LocalizedText = Readonly<Record<Locale, string>>;

export type SocialLink = Readonly<{
  label: string;
  href: string;
}>;

export type EducationItem = Readonly<{
  program: LocalizedText;
  institution: string;
}>;

export type ExperienceItem = Readonly<{
  role: string;
  company: string;
  technologies: readonly string[];
  summary: LocalizedText;
  highlights: Readonly<Record<Locale, readonly string[]>>;
}>;

export type HobbyItem = Readonly<{
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
}>;

export type ProductItem = Readonly<{
  name: string;
  marketplace: string;
  category: LocalizedText;
  opinion: LocalizedText | null;
  imageUrl: string | null;
  referralUrl: string | null;
}>;

export type NavigationItem = Readonly<{
  label: string;
  href: string;
}>;
