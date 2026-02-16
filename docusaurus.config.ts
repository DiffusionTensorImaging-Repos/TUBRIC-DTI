import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'TUBRIC DTI Preprocessing Tutorial',
  tagline: 'A comprehensive, open-source guide to diffusion tensor imaging preprocessing',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://diffusiontensorimaging-repos.github.io',
  baseUrl: '/TUBRIC-DTI/',

  organizationName: 'DiffusionTensorImaging-Repos',
  projectName: 'TUBRIC-DTI',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-nB0miv6/jRmo5OCLP6UMOUIycbeFwJKPBOPA3OJSSgMJ0OdPsJUm3GNH6LFLfb3p',
      crossorigin: 'anonymous',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/DiffusionTensorImaging-Repos/TUBRIC-DTI/tree/main/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/tubric-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'DTI Tutorial',
      logo: {
        alt: 'TUBRIC Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          to: '/docs/tools/overview',
          label: 'Tools',
          position: 'left',
        },
        {
          href: 'https://github.com/DiffusionTensorImaging-Repos/SDN-IMPACT-DTI',
          label: 'IMPACT Reference',
          position: 'right',
        },
        {
          href: 'https://github.com/DiffusionTensorImaging-Repos/TUBRIC-DTI',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Tutorial',
          items: [
            {label: 'Getting Started', to: '/docs/intro'},
            {label: 'Pipeline Overview', to: '/docs/pipeline/overview'},
            {label: 'Glossary', to: '/docs/reference/glossary'},
          ],
        },
        {
          title: 'Tools',
          items: [
            {label: 'FSL', href: 'https://fsl.fmrib.ox.ac.uk/fsl/fslwiki'},
            {label: 'ANTs', href: 'https://github.com/ANTsX/ANTs'},
            {label: 'MRtrix3', href: 'https://www.mrtrix.org/'},
            {label: 'QSIPrep', href: 'https://qsiprep.readthedocs.io/'},
            {label: 'dcm2niix', href: 'https://github.com/rordenlab/dcm2niix'},
            {label: 'pyAFQ', href: 'https://yeatmanlab.github.io/pyAFQ/'},
          ],
        },
        {
          title: 'About',
          items: [
            {label: 'TUBRIC', href: 'https://www.temple.edu/research/tubric'},
            {label: 'Temple University', href: 'https://www.temple.edu'},
            {label: 'IMPACT Reference Pipeline', href: 'https://github.com/DiffusionTensorImaging-Repos/SDN-IMPACT-DTI'},
          ],
        },
      ],
      copyright: `Copyright \u00A9 ${new Date().getFullYear()} Temple University Brain Research Imaging Center (TUBRIC). Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'python', 'toml', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
