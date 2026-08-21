import Image from 'next/image';
import type { ComponentType } from 'react';
import { AcademicCapIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Github, Linkedin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';

const OrcidIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
  </svg>
);

interface ProfileProps {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  researchInterests?: string[];
}

export default function Profile({ author, social, researchInterests }: ProfileProps) {
  const socialLinks: Array<{
    name: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
    external: boolean;
  }> = [];

  if (social.email) {
    socialLinks.push({
      name: 'Email',
      href: `mailto:${social.email}`,
      icon: EnvelopeIcon,
      external: false,
    });
  }
  if (social.google_scholar) {
    socialLinks.push({
      name: 'Google Scholar',
      href: social.google_scholar,
      icon: AcademicCapIcon,
      external: true,
    });
  }
  if (social.orcid) {
    socialLinks.push({
      name: 'ORCID',
      href: social.orcid,
      icon: OrcidIcon,
      external: true,
    });
  }
  if (social.github) {
    socialLinks.push({
      name: 'GitHub',
      href: social.github,
      icon: Github,
      external: true,
    });
  }
  if (social.linkedin) {
    socialLinks.push({
      name: 'LinkedIn',
      href: social.linkedin,
      icon: Linkedin,
      external: true,
    });
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div className="mx-auto mb-6 h-56 w-56 overflow-hidden rounded-2xl border border-neutral-200 shadow-sm dark:border-neutral-700">
        <Image
          src={author.avatar}
          alt={author.name}
          width={256}
          height={256}
          className="h-full w-full object-cover object-[32%_center]"
          priority
        />
      </div>

      <div className="mb-6 text-center">
        <h1 className="mb-2 font-serif text-3xl font-bold text-primary">{author.name}</h1>
        <p className="mb-1 text-lg font-medium text-accent">{author.title}</p>
        <p className="mb-2 text-neutral-600 dark:text-neutral-300">{author.institution}</p>
      </div>

      <div className="relative mb-6 flex flex-wrap justify-center gap-3 px-2 sm:gap-4">
        {socialLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="rounded-md p-2 text-neutral-600 transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-neutral-300"
              aria-label={link.name}
              title={link.name}
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </div>

      {researchInterests && researchInterests.length > 0 && (
        <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-3 font-semibold text-primary">Research Interests</h2>
          <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            {researchInterests.map((interest) => (
              <div key={interest}>{interest}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
