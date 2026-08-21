'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BookOpenIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from './FormattedBibTeXText';

interface PublicationsListProps {
  config: PublicationPageConfig;
  publications: Publication[];
  embedded?: boolean;
}

const idleActionClasses =
  'bg-neutral-100 text-neutral-700 hover:bg-accent hover:text-white dark:bg-neutral-800 dark:text-neutral-300';

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
  const messages = useMessages();
  const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);

  const copyBibTeX = async (pub: Publication) => {
    try {
      await navigator.clipboard.writeText(pub.bibtex || '');
      setCopiedBibtexId(pub.id);
      window.setTimeout(() => setCopiedBibtexId((current) => current === pub.id ? null : current), 1800);
    } catch {
      setCopiedBibtexId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} mb-4 font-serif font-bold text-primary`}>
          {config.title}
        </h1>
        {config.description && (
          <p className={`${embedded ? 'text-base' : 'text-lg'} max-w-2xl text-neutral-600 dark:text-neutral-400`}>
            {config.description}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {publications.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">
            {messages.publications.noResults}
          </div>
        ) : (
          publications.map((pub) => (
            <article
              key={pub.id}
              className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex flex-col gap-6 md:flex-row">
                {pub.preview && (
                  <div className="w-full flex-shrink-0 md:w-48">
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 md:aspect-[4/3]">
                      <Image
                        src={`/papers/${pub.preview}`}
                        alt={pub.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 192px"
                      />
                    </div>
                  </div>
                )}

                <div className="min-w-0 flex-grow">
                  <h2 className={`${embedded ? 'text-lg' : 'text-xl'} mb-2 font-semibold leading-tight text-primary`}>
                    <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                  </h2>

                  <p className={`${embedded ? 'text-sm' : 'text-base'} mb-1 text-neutral-600 dark:text-neutral-400`}>
                    {pub.authors.map((author, index) => (
                      <span key={`${pub.id}-${author.name}`}>
                        <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                          {author.name}
                        </span>
                        {author.isEqualContribution && <sup aria-label="equal contribution">*</sup>}
                        {author.isCorresponding && (
                          <sup className={author.isHighlighted ? 'text-accent' : ''}>†</sup>
                        )}
                        {index < pub.authors.length - 1 && ', '}
                      </span>
                    ))}
                  </p>

                  {pub.authors.some((author) => author.isEqualContribution) && (
                    <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">* Equal contribution</p>
                  )}

                  <p className="mb-3 text-sm font-medium text-neutral-800 dark:text-neutral-300">
                    {pub.journal || pub.conference} {pub.year}
                  </p>

                  {pub.description && (
                    <p className="mb-4 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
                      {pub.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Paper: ${pub.title}`}
                        className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${idleActionClasses}`}
                      >
                        Paper
                      </a>
                    )}
                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`DOI: ${pub.title}`}
                        className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${idleActionClasses}`}
                      >
                        DOI
                      </a>
                    )}
                    {pub.code && (
                      <a
                        href={pub.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${messages.publications.code}: ${pub.title}`}
                        className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${idleActionClasses}`}
                      >
                        {messages.publications.code}
                      </a>
                    )}
                    {pub.abstract && (
                      <button
                        type="button"
                        onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                        aria-expanded={expandedAbstractId === pub.id}
                        aria-controls={`${pub.id}-abstract`}
                        aria-label={`${messages.publications.abstract}: ${pub.title}`}
                        className={cn(
                          'inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                          expandedAbstractId === pub.id ? 'bg-accent text-white' : idleActionClasses
                        )}
                      >
                        <DocumentTextIcon className="mr-1.5 h-3 w-3" />
                        {messages.publications.abstract}
                      </button>
                    )}
                    {pub.bibtex && (
                      <button
                        type="button"
                        onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                        aria-expanded={expandedBibtexId === pub.id}
                        aria-controls={`${pub.id}-bibtex`}
                        aria-label={`${messages.publications.bibtex}: ${pub.title}`}
                        className={cn(
                          'inline-flex items-center rounded-md px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                          expandedBibtexId === pub.id ? 'bg-accent text-white' : idleActionClasses
                        )}
                      >
                        <BookOpenIcon className="mr-1.5 h-3 w-3" />
                        {messages.publications.bibtex}
                      </button>
                    )}
                  </div>

                  {expandedAbstractId === pub.id && pub.abstract && (
                    <div id={`${pub.id}-abstract`} className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{pub.abstract}</p>
                    </div>
                  )}

                  {expandedBibtexId === pub.id && pub.bibtex && (
                    <div id={`${pub.id}-bibtex`} className="relative mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                      <pre className="overflow-x-auto whitespace-pre-wrap pr-24 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                        {pub.bibtex}
                      </pre>
                      <button
                        type="button"
                        onClick={() => copyBibTeX(pub)}
                        className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1.5 text-xs text-neutral-600 shadow-sm transition-colors hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200"
                        aria-label={`${messages.common.copyToClipboard}: ${pub.title}`}
                      >
                        {copiedBibtexId === pub.id ? (
                          <><CheckIcon className="h-4 w-4" /> Copied</>
                        ) : (
                          <><ClipboardDocumentIcon className="h-4 w-4" /> Copy</>
                        )}
                      </button>
                      <span className="sr-only" aria-live="polite">
                        {copiedBibtexId === pub.id ? `Copied BibTeX for ${pub.title}` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
