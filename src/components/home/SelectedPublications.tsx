'use client';

import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="rounded text-sm font-medium text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub) => (
                    <article
                        key={pub.id}
                        className="bg-neutral-50/70 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors duration-200 hover:border-accent/40"
                    >
                        <h3 className="font-semibold text-primary mb-2 leading-tight">
                            <a
                                href={pub.url || (pub.doi ? `https://doi.org/${pub.doi}` : undefined)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-accent transition-colors"
                            >
                                <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                            </a>
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                        {author.name}
                                    </span>
                                    {author.isEqualContribution && <sup aria-label="equal contribution">*</sup>}
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'}`}>†</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        {pub.authors.some((author) => author.isEqualContribution) && (
                            <p className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">* Equal contribution</p>
                        )}
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">
                            {pub.journal || pub.conference} · {pub.year}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}
