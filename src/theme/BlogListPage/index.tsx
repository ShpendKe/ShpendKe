import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import './styles.css';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type { Props } from '@theme/BlogListPage';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';

function BlogListPageMetadata(props: Props): ReactNode {
  const { metadata } = props;
  const {
    siteConfig: { title: siteTitle },
  } = useDocusaurusContext();
  const { blogDescription, blogTitle, permalink } = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): ReactNode {
  const { metadata, items, sidebar } = props;

  return (
    <BlogLayout sidebar={sidebar}>
      <div className="row">
        <main className="col col--12">
          <div className="blog-list-container">
            {items.map(({ content: BlogPostContent }) => {
              const itemMetadata = BlogPostContent.metadata;

              const authors = itemMetadata.authors;
              const { tags } = itemMetadata;
              const image = BlogPostContent.assets.image;
              const excerpt = itemMetadata.description || 'Read more...';
              return (
                <div key={itemMetadata.permalink} className="blog-post-card">
                  {image && (
                    <div className="blog-post-image">
                      <img src={image} alt={itemMetadata.title} />
                    </div>
                  )}
                  <div className="blog-post-content">
                    <a href={itemMetadata.permalink}>
                      <h2>{itemMetadata.title}</h2>
                    </a>                    
                    {authors && authors.length > 0 && (
                      <div className="blog-post-authors">
                        {authors.map((author, idx) => (
                          <span key={idx} className="blog-post-author">
                            {author.name}
                            {idx < authors.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="blog-post-meta">
                      <span>{new Date(itemMetadata.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      {itemMetadata.readingTime && <span>·</span>}
                      {itemMetadata.readingTime && <span>{Math.ceil(itemMetadata.readingTime)} min read</span>}
                    </div>
                    <p>{excerpt}</p>
                    {tags && tags.length > 0 && (
                      <div className="blog-post-tags">
                        {tags.map((tag, idx) => (
                          <a key={idx} href={tag.permalink} className="blog-post-tag">
                            {tag.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <BlogListPaginator metadata={metadata} />
        </main>
      </div>
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
