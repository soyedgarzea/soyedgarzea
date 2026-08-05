import { products } from '@/content/site.data';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import type { ItemsPageProps } from './items-page.types';

export function ItemsPage({ locale }: ItemsPageProps) {
  const es = locale === 'es';

  return (
    <main>
      <div className='page-shell'>
        <SiteHeader
          languageHref={es ? '/en/items' : '/compras'}
          locale={locale}
        />
        <header className='items-hero'>
          <p className='eyebrow'>{es ? 'Probado por mí' : 'Tried by me'}</p>
          <h1>{es ? 'Cosas que he comprado' : 'Things I have bought'}</h1>
          <p>
            {es
              ? 'Una lista honesta de objetos que forman parte de mis hobbies y mi día a día.'
              : 'An honest list of objects that are part of my hobbies and everyday life.'}
          </p>
        </header>

        <aside className='affiliate-note'>
          <span aria-hidden='true'>◎</span>
          <p>
            {es
              ? 'Próximamente algunos enlaces serán de afiliado. Si compras mediante ellos, podría recibir una comisión sin costo extra para ti. Las opiniones siempre serán mías.'
              : 'Some links will soon be affiliate links. If you buy through them, I may earn a commission at no extra cost to you. The opinions will always be my own.'}
          </p>
        </aside>

        <section
          className='product-grid'
          aria-label={es ? 'Productos' : 'Products'}
        >
          {products.map((product, index) => (
            <article
              className='product-card'
              key={product.name}
            >
              <div className={`product-art product-art-${index + 1}`}>
                <span>{product.marketplace}</span>
                <strong>0{index + 1}</strong>
              </div>
              <div className='product-body'>
                <p className='product-category'>{product.category[locale]}</p>
                <h2>{product.name}</h2>
                <p className='product-opinion'>
                  {product.opinion?.[locale] ??
                    (es
                      ? 'Mi reseña estará disponible próximamente.'
                      : 'My review will be available soon.')}
                </p>
                {product.referralUrl ? (
                  <a
                    href={product.referralUrl}
                    rel='nofollow sponsored noreferrer'
                    target='_blank'
                  >
                    {es ? `Ver en ${product.marketplace} ↗` : `View on ${product.marketplace} ↗`}
                  </a>
                ) : (
                  <span className='coming-soon'>
                    {es ? 'Enlace próximamente' : 'Link coming soon'}
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>
        <SiteFooter locale={locale} />
      </div>
    </main>
  );
}
