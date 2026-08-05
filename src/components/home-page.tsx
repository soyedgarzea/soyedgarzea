import Link from 'next/link';
import { education, experience, hobbies, profile, socialLinks } from '@/content/site.data';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import type { HomePageProps } from './home-page.types';

export function HomePage({ locale }: HomePageProps) {
  const es = locale === 'es';

  return (
    <main>
      <div className='page-shell'>
        <SiteHeader
          languageHref={es ? '/en' : '/'}
          locale={locale}
        />

        <section className='hero'>
          <div className='hero-copy'>
            <p className='eyebrow'>{es ? 'Hola, soy' : 'Hi, I’m'}</p>
            <h1>{profile.name}</h1>
            <p className='hero-role'>{profile.roles[locale]}</p>
            <p className='hero-intro'>{profile.intro[locale]}</p>
            <div className='hero-actions'>
              <a
                className='button button-primary'
                href={es ? '#experiencia' : '#experience'}
              >
                {es ? 'Ver mi recorrido' : 'See my journey'}
              </a>
              <Link
                className='button button-ghost'
                href={es ? '/compras' : '/en/items'}
              >
                {es ? 'Cosas que recomiendo' : 'Things I recommend'}
              </Link>
            </div>
          </div>
          <div
            aria-label={es ? 'Retrato abstracto de Edgar' : 'Abstract portrait of Edgar'}
            className='portrait-card'
          >
            <div className='portrait-orbit portrait-orbit-one' />
            <div className='portrait-orbit portrait-orbit-two' />
            <span className='portrait-initials'>EZ</span>
            <span className='portrait-note'>México · Zinns · Software</span>
          </div>
        </section>

        <section
          className='section about-grid'
          id={es ? 'sobre-mi' : 'about-me'}
        >
          <div>
            <p className='eyebrow'>{es ? 'Más que código' : 'More than code'}</p>
            <h2>{es ? 'Muchas vidas caben en una historia' : 'Many lives fit into one story'}</h2>
          </div>
          <p className='large-copy'>{profile.bio[locale]}</p>
        </section>

        <section className='section'>
          <div className='section-heading'>
            <p className='eyebrow'>{es ? 'Lo que me mueve' : 'What moves me'}</p>
            <h2>{es ? 'Intereses sin una sola etiqueta' : 'Interests without a single label'}</h2>
          </div>
          <div className='hobby-grid'>
            {hobbies.map(hobby => (
              <article
                className='hobby-card'
                key={hobby.title.en}
              >
                <span
                  className='hobby-icon'
                  aria-hidden='true'
                >
                  {hobby.icon}
                </span>
                <h3>{hobby.title[locale]}</h3>
                <p>{hobby.description[locale]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className='section education-section'>
          <div className='section-heading'>
            <p className='eyebrow'>{es ? 'Educación' : 'Education'}</p>
            <h2>{es ? 'Aprender cambia la perspectiva' : 'Learning changes perspective'}</h2>
          </div>
          <div className='education-list'>
            {education.map((item, index) => (
              <article key={item.institution}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{item.program[locale]}</h3>
                  <p>{item.institution}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className='section'
          id={es ? 'experiencia' : 'experience'}
        >
          <div className='section-heading'>
            <p className='eyebrow'>{es ? 'Experiencia' : 'Experience'}</p>
            <h2>
              {es ? 'Productos, equipos y problemas reales' : 'Products, teams, and real problems'}
            </h2>
          </div>
          <div className='timeline'>
            {experience.map(job => (
              <article
                className='job'
                key={`${job.company}-${job.role}`}
              >
                <div className='job-title'>
                  <h3>{job.role}</h3>
                  <p>{job.company}</p>
                </div>
                <div className='job-detail'>
                  <p className='job-summary'>{job.summary[locale]}</p>
                  <ul>
                    {job.highlights[locale].map(highlight => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className='tag-list'>
                    {job.technologies.map(technology => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className='zinns-section'>
          <p className='eyebrow'>Zinns</p>
          <h2>{es ? 'Fundar también es construir.' : 'Founding is building, too.'}</h2>
          <p>
            {es
              ? 'Soy fundador de Zinns, compañía donde la tecnología se convierte en herramientas digitales hechas alrededor de problemas humanos reales.'
              : 'I founded Zinns, a company where technology becomes digital tools shaped around real human problems.'}
          </p>
          <a
            href='https://zinns.io'
            rel='noreferrer'
            target='_blank'
          >
            {es ? 'Conocer Zinns ↗' : 'Discover Zinns ↗'}
          </a>
        </section>

        <section className='section connect-section'>
          <p className='eyebrow'>{es ? 'Conectemos' : 'Let’s connect'}</p>
          <h2>{es ? 'Encuéntrame en internet' : 'Find me around the internet'}</h2>
          <div className='social-cards'>
            {socialLinks.map(social => (
              <a
                href={social.href}
                key={social.label}
                rel='noreferrer'
                target='_blank'
              >
                <span>{social.label}</span>
                <span>↗</span>
              </a>
            ))}
          </div>
        </section>

        <SiteFooter locale={locale} />
      </div>
    </main>
  );
}
