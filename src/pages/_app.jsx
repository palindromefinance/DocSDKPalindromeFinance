import Head from 'next/head'
import { slugifyWithCounter } from '@sindresorhus/slugify'

import { Layout } from '@/components/Layout'

import 'focus-visible'
import '@/styles/tailwind.css'

function getNodeText(node) {
  let text = ''
  for (let child of node.children ?? []) {
    if (typeof child === 'string') {
      text += child
    }
    text += getNodeText(child)
  }
  return text
}

function collectHeadings(nodes, slugify = slugifyWithCounter()) {
  let sections = []

  for (let node of nodes) {
    if (node.name === 'h2' || node.name === 'h3') {
      let title = getNodeText(node)
      if (title) {
        let id = slugify(title)
        node.attributes.id = id
        if (node.name === 'h3') {
          if (!sections[sections.length - 1]) {
            throw new Error(
              'Cannot add `h3` to table of contents without a preceding `h2`'
            )
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          })
        } else {
          sections.push({ ...node.attributes, title, children: [] })
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify))
  }

  return sections
}

export default function App({ Component, pageProps }) {
  let title = pageProps.markdoc?.frontmatter.title

  let pageTitle =
    pageProps.markdoc?.frontmatter.pageTitle ||
    `${pageProps.markdoc?.frontmatter.title} - Docs`

  let description = pageProps.markdoc?.frontmatter.description

  let tableOfContents = pageProps.markdoc?.content
    ? collectHeadings(pageProps.markdoc.content)
    : []

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: pageTitle,  // Better: use the dynamic page title
              description: description || "Crypto Pay Gateway & Checkout System for your Business.", // fallback if needed
              url: typeof window !== 'undefined' ? window.location.href : "https://sdk.palindromefinance.com/", // or use a prop for canonical URL
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.palindromefinance.com"
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Docs",
                    item: "https://sdk.palindromefinance.com"
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: title || "Getting Started", // use dynamic title
                    item: typeof window !== 'undefined' ? window.location.href : "https://sdk.palindromefinance.com/" // current page URL
                  }
                ]
              }
            })
          }}
        />
      </Head>
      <Layout title={title} tableOfContents={tableOfContents}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
