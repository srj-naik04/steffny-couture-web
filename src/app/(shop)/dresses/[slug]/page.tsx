/**
 * Product detail page — Phase 4
 *
 * Server component. Pre-renders all 10 product slugs via generateStaticParams.
 * Client sub-components: ImageCarousel, VariantSelector, AddToCartButton.
 *
 * Layout (top to bottom):
 * 1. Breadcrumb
 * 2. Two-column: ImageCarousel | product info (stacks on mobile)
 * 3. Story section (full-width, if present)
 * 4. Related dresses
 * 5. FinalCta
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { FinalCta } from '@/components/marketing/FinalCta';
import { RevealOnScroll } from '@/components/marketing/RevealOnScroll';
import { ImageCarousel } from '@/features/catalog/components/ImageCarousel';
import { VariantProvider } from '@/features/catalog/components/VariantContext';
import { VariantSelector } from '@/features/catalog/components/VariantSelector';
import { AddToCartButton } from '@/features/catalog/components/AddToCartButton';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import {
  getProductBySlugFromSource,
  getRelatedProductsFromSource,
  getAllProductSlugsFromSource,
} from '@/features/products/source';
import { formatGBP } from '@/lib/currency';
import { siteUrl } from '@/lib/env';
import { safeJsonLd } from '@/lib/seo/jsonld';
import { BRAND, STUDIO } from '@/constants/brand';

// ---------------------------------------------------------------------------
// Static params — pre-render all 10 slugs at build time
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const slugs = await getAllProductSlugsFromSource();
  return slugs.map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromSource(slug);

  if (!product) {
    return {
      title: 'Dress not found',
    };
  }

  const ogImage =
    product.images?.[0]?.storage_path?.startsWith('/')
      ? `${siteUrl}${product.images[0].storage_path}`
      : `${siteUrl}/assets/products/${slug}/01.jpg`;

  const description =
    product.short_description ??
    product.description.slice(0, 155).trimEnd() + '…';

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `${siteUrl}/dresses/${slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      url: `${siteUrl}/dresses/${slug}`,
      siteName: BRAND.name,
      title: `${product.name} — Steffny Couture`,
      description,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 1200,
          alt: product.name,
        },
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlugFromSource(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProductsFromSource(product.id, product.category, 3);

  // Build WhatsApp prefill message
  const whatsappMessage = encodeURIComponent(
    `Hi Steffi, I'm interested in the ${product.name} (${slug}). Could you tell me more?`,
  );
  const whatsappHref = `https://wa.me/447834877992?text=${whatsappMessage}`;

  // Primary image path (for AddToCartButton)
  const primaryImagePath =
    product.images?.[0]?.storage_path?.startsWith('/')
      ? product.images[0].storage_path
      : `/assets/products/${slug}/01.jpg`;

  // Auto-select defaults for VariantProvider (single option each)
  const defaultSize =
    product.available_sizes.length === 1 ? product.available_sizes[0] : null;
  const defaultColour =
    product.available_colours.length === 1
      ? product.available_colours[0]
      : null;

  // Product JSON-LD
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description ?? product.description,
    image: [`${siteUrl}/assets/products/${slug}/01.jpg`],
    sku: slug,
    brand: {
      '@type': 'Brand',
      name: BRAND.name,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability:
        (product.stock === null || product.stock > 0)
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/dresses/${slug}`,
      seller: {
        '@type': 'Organization',
        name: BRAND.name,
        url: siteUrl,
      },
    },
  };

  const categoryLabel =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-ivory border-border border-b"
      >
        <Container>
          <ol className="flex items-center gap-2 py-3 text-small text-ink-muted">
            <li>
              <Link href="/" className="hover:text-rose transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/dresses" className="hover:text-rose transition-colors">
                Dresses
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink font-medium" aria-current="page">
              {product.name}
            </li>
          </ol>
        </Container>
      </nav>

      {/* Main content */}
      <Section tone="ivory" spacing="md">
        <Container>
          <VariantProvider
            defaultSize={defaultSize}
            defaultColour={defaultColour}
          >
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] lg:gap-16">
              {/* Left: Image carousel */}
              <div className="w-full">
                <ImageCarousel
                  images={product.images ?? []}
                  productName={product.name}
                />
              </div>

              {/* Right: Product info */}
              <div className="flex flex-col gap-6">
                {/* Category kicker */}
                <span className="text-label text-rose tracking-widest uppercase">
                  {categoryLabel}
                </span>

                {/* Name */}
                <h1 className="font-display text-display-sm md:text-title text-ink leading-tight">
                  {product.name}
                </h1>

                {/* Gold rule */}
                <div className="h-px w-12 bg-gold" aria-hidden="true" />

                {/* Short description */}
                {product.short_description && (
                  <p className="text-body-lg text-ink-muted">
                    {product.short_description}
                  </p>
                )}

                {/* Price */}
                <p className="font-display text-title text-ink">
                  {formatGBP(product.price)}
                </p>

                {/* Description */}
                <p className="text-body text-ink-muted">
                  {product.description}
                </p>

                {/* Variant selector */}
                <VariantSelector
                  availableSizes={product.available_sizes}
                  availableColours={product.available_colours}
                />

                {/* CTAs */}
                <div className="flex flex-col gap-3 pt-2">
                  <AddToCartButton
                    productId={product.id}
                    slug={slug}
                    name={product.name}
                    price={product.price}
                    currency={product.currency}
                    imagePath={primaryImagePath}
                    requiresSize={product.available_sizes.length > 1}
                    requiresColour={product.available_colours.length > 1}
                  />

                  <Button
                    href={whatsappHref}
                    variant="secondary"
                    fullWidth
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enquire on WhatsApp
                  </Button>

                  <Button href="/book" variant="ghost" fullWidth className="bg-surface-alt text-ink border-border hover:bg-surface">
                    Book a fitting
                  </Button>
                </div>

                {/* Separator */}
                <div className="h-px bg-border" aria-hidden="true" />

                {/* Notes */}
                <dl className="space-y-2 text-small text-ink-muted">
                  <div className="flex gap-2">
                    <dt className="text-label font-medium uppercase tracking-widest text-ink-muted">
                      Made
                    </dt>
                    <dd>Crafted in London at the Steffny Couture studio, Hounslow.</dd>
                  </div>
                  {product.length && (
                    <div className="flex gap-2">
                      <dt className="text-label font-medium uppercase tracking-widest text-ink-muted">
                        Length
                      </dt>
                      <dd className="capitalize">{product.length}</dd>
                    </div>
                  )}
                  {product.occasion.length > 0 && (
                    <div className="flex gap-2">
                      <dt className="text-label font-medium uppercase tracking-widest text-ink-muted">
                        Occasions
                      </dt>
                      <dd className="capitalize">
                        {product.occasion.map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(', ')}
                      </dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt className="text-label font-medium uppercase tracking-widest text-ink-muted">
                      Care
                    </dt>
                    <dd>Dry clean only. Store in a breathable garment bag.</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-label font-medium uppercase tracking-widest text-ink-muted">
                      Studio
                    </dt>
                    <dd>{STUDIO.address}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </VariantProvider>
        </Container>
      </Section>

      {/* Story section */}
      {product.story && (
        <Section tone="surface" spacing="md">
          <Container size="narrow">
            <RevealOnScroll>
              <div className="space-y-4 text-center">
                <span className="text-label text-rose tracking-widest uppercase">
                  The story
                </span>
                <div className="h-px w-12 bg-gold mx-auto" aria-hidden="true" />
                <p className="text-body-lg text-ink-muted text-pretty leading-relaxed">
                  {product.story}
                </p>
              </div>
            </RevealOnScroll>
          </Container>
        </Section>
      )}

      {/* Related dresses */}
      {related.length > 0 && (
        <Section tone="ivory" spacing="md">
          <Container>
            <RevealOnScroll>
              <div className="space-y-8">
                <div className="text-center">
                  <span className="text-label text-rose tracking-widest uppercase">
                    You might also like
                  </span>
                  <h2 className="font-display text-display-sm text-ink mt-3">
                    Similar pieces
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((relProduct) => (
                    <ProductCard key={relProduct.id} product={relProduct} />
                  ))}
                </div>
                <div className="text-center">
                  <Button href="/dresses" variant="secondary">
                    View the full collection
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          </Container>
        </Section>
      )}

      {/* Final CTA */}
      <FinalCta
        headline="Every piece is made to be worn"
        body="Visit the studio for a fitting, or enquire about a custom commission. Steffi and the team are available six days a week in Hounslow."
        primaryCta={{ label: 'Book a fitting', href: '/book' }}
        secondaryCta={{ label: 'Get in touch', href: '/contact' }}
      />
    </>
  );
}
