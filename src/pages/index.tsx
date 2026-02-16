import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const PIPELINE_STAGES = [
  {num: 1, title: 'DICOM to NIfTI', tools: 'dcm2niix', link: '/docs/pipeline/dicom-to-nifti'},
  {num: 2, title: 'Skull Stripping', tools: 'ANTs', link: '/docs/pipeline/skull-stripping'},
  {num: 3, title: 'B0 Concatenation', tools: 'FSL', link: '/docs/pipeline/b0-concatenation'},
  {num: 4, title: 'TOPUP Distortion Correction', tools: 'FSL', link: '/docs/pipeline/topup'},
  {num: 5, title: 'Mean B0 Image', tools: 'FSL', link: '/docs/pipeline/mean-b0'},
  {num: 6, title: 'Brain Masking', tools: 'FSL', link: '/docs/pipeline/brain-masking'},
  {num: 7, title: 'Denoising & Gibbs Correction', tools: 'MRtrix3', link: '/docs/pipeline/denoising-gibbs'},
  {num: 8, title: 'Eddy Current Correction', tools: 'FSL', link: '/docs/pipeline/eddy'},
  {num: 9, title: 'BedpostX', tools: 'FSL', link: '/docs/pipeline/bedpostx'},
  {num: 10, title: 'Shell Extraction', tools: 'MRtrix3', link: '/docs/pipeline/shell-extraction'},
  {num: 11, title: 'Tensor Fitting (DTIFIT)', tools: 'FSL', link: '/docs/pipeline/dtifit'},
  {num: 12, title: 'Registration (FLIRT)', tools: 'FSL', link: '/docs/pipeline/flirt-registration'},
  {num: 13, title: 'ICV Calculation', tools: 'ANTs / FSL', link: '/docs/pipeline/icv-calculation'},
  {num: 14, title: 'BIDS & pyAFQ', tools: 'pyAFQ', link: '/docs/pipeline/pyafq-bids'},
];

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
  link: string;
  linkText: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Learn DTI Concepts',
    icon: '\uD83E\uDDE0',
    description: (
      <>
        Understand the physics of diffusion imaging, what FA, MD, and RD actually
        measure, and why each preprocessing step matters for your science.
      </>
    ),
    link: '/docs/foundations/what-is-dti',
    linkText: 'Start Learning',
  },
  {
    title: 'Step-by-Step Pipeline',
    icon: '\uD83D\uDD27',
    description: (
      <>
        Walk through each preprocessing stage with generalized, copy-paste-ready
        code, detailed explanations, and quality checks at every step.
      </>
    ),
    link: '/docs/pipeline/overview',
    linkText: 'View Pipeline',
  },
  {
    title: 'Interactive Practice',
    icon: '\uD83D\uDE80',
    description: (
      <>
        Launch a free cloud environment with pre-installed tools and public DTI data.
        Run real FSL and MRtrix3 commands in your browser -- no setup required.
      </>
    ),
    link: '/docs/reference/practice-data',
    linkText: 'Try It Out',
  },
];

function Feature({title, icon, description, link, linkText}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="feature-card">
        <div className="text--center" style={{fontSize: '3rem', marginBottom: '1rem'}}>
          {icon}
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
          <Link className="button button--primary button--sm" to={link}>
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
}

function PipelinePreview() {
  return (
    <section className={styles.pipelineSection}>
      <div className="container">
        <Heading as="h2" className="text--center" style={{marginBottom: '0.5rem'}}>
          A DTI Preprocessing Pipeline
        </Heading>
        <p className="text--center" style={{marginBottom: '2rem', color: 'var(--ifm-color-emphasis-600)'}}>
          One example workflow from raw scanner output to analysis-ready diffusion metrics.
          Your pipeline may include fewer or more steps depending on your data and goals.
        </p>
        <div className="pipeline-explorer">
          {PIPELINE_STAGES.map((stage, idx) => (
            <div key={stage.num}>
              <Link to={stage.link} className="pipeline-explorer__stage">
                <div className="pipeline-explorer__number">{stage.num}</div>
                <div className="pipeline-explorer__content">
                  <p className="pipeline-explorer__title">{stage.title}</p>
                  <p className="pipeline-explorer__tools">{stage.tools}</p>
                </div>
              </Link>
              {idx < PIPELINE_STAGES.length - 1 && (
                <div className="pipeline-explorer__arrow">&darr;</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>Temple University Brain Research Imaging Center</p>
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/intro">
              Get Started
            </Link>
            <Link
              className="button button--outline button--lg"
              to="/docs/pipeline/overview"
              style={{color: 'white', borderColor: 'rgba(255,255,255,0.5)', marginLeft: '1rem'}}
            >
              View Pipeline
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="A comprehensive, open-source tutorial for diffusion tensor imaging preprocessing from the Temple University Brain Research Imaging Center (TUBRIC).">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row" style={{gap: '1.5rem 0'}}>
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        <PipelinePreview />
      </main>
    </Layout>
  );
}
