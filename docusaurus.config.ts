import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";

// cspell:ignore ZEU
const config: Config = {
  title: "H-Group Conventions",
  url: "https://hgroup-ru.github.io",
  baseUrl: "/",
  favicon: "img/favicon.ico",

  // With the default (undefined), Docusaurus emits pages as "/path/index.html" but writes
  // canonical/sitemap/og URLs without a trailing slash, so GitHub Pages 301-redirects "/path" to
  // "/path/". The Algolia crawler then follows the sitemap into those redirects (whose canonical
  // points back at the redirecting URL) and drops every page, collapsing the index to 1 record.
  // Setting this to false emits "/path.html", which GitHub Pages serves directly at "/path" with no
  // redirect and no canonical mismatch, while keeping the same no-slash URLs (so relative links
  // resolve unchanged).
  trailingSlash: false,

  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru"],
    localeConfigs: {
      en: { label: "English", htmlLang: "en" },
      ru: {
        label: "\u{420}\u{443}\u{441}\u{441}\u{43A}\u{438}\u{439}",
        htmlLang: "ru-RU",
      },
    },
  },

  future: {
    faster: true,
    v4: true,
  },

  onBrokenAnchors: "throw",
  onDuplicateRoutes: "throw",
  tagline: undefined,
  organizationName: "hgroup-ru",
  projectName: "hgroup-ru.github.io",

  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
      },
    },

    navbar: {
      title: "H-Group Conventions",
      logo: {
        alt: "H-Group Logo",
        src: "img/logo.png",
      },
      items: [
        {
          to: "beginner",
          activeBasePath: "docs",
          label: "Beginner",
          position: "left",
        },
        {
          to: "learning-path",
          activeBasePath: "docs",
          label: "Learning Path",
          position: "left",
        },
        {
          to: "reference",
          activeBasePath: "docs",
          label:
            "\u{421}\u{43F}\u{440}\u{430}\u{432}\u{43E}\u{447}\u{43D}\u{438}\u{43A}",
          position: "left",
        },
        {
          to: "variant-specific",
          activeBasePath: "docs",
          label: "Variant-Specific",
          position: "left",
        },
        {
          to: "glossary",
          activeBasePath: "docs",
          label: "\u{421}\u{43B}\u{43E}\u{432}\u{430}\u{440}\u{44C}",
          position: "left",
        },
        {
          type: "custom-myLevel",
          position: "right",
        },
        {
          href: "https://github.com/hgroup-ru/hgroup-ru.github.io/",
          className: "header-github-link",
          position: "right",
          title:
            "\u{47}\u{69}\u{74}\u{48}\u{75}\u{62} \u{440}\u{443}\u{441}\u{441}\u{43A}\u{43E}\u{439} \u{432}\u{435}\u{440}\u{441}\u{438}\u{438}",
        },
        {
          href: "https://discord.gg/FADvkJp",
          className: "header-discord-link",
          position: "right",
        },
      ],
    },

    colorMode: {
      defaultMode: "dark",
    },

    algolia: {
      appId: "U5ZEU3Z8TE",
      apiKey: "b8166c330d4d315137f20cbb32dd71a4",
      indexName: "hgroup-ru-docsearch",
      contextualSearch: false,
      searchPagePath: "search",
    },
  } satisfies Preset.ThemeConfig,

  plugins: ["./plugins/hanabiDocusaurusPlugin/index.ts"],
  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/", // Serve the docs at the site's root.
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/hgroup-ru/hgroup-ru.github.io/edit/main/",
          editLocalizedFiles: true,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  scripts: [
    // Font Awesome is used for the icons on the landing page.
    // https://fontawesome.com/kits/1932a73877/setup
    {
      src: "https://kit.fontawesome.com/1932a73877.js",
      crossorigin: "anonymous",
    },

    // We provide some keyboard shortcuts for easier navigation.
    "/js/hotkey.js",
  ],

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },

    // Enable Mermaid diagrams:
    // https://docusaurus.io/docs/markdown-features/diagrams
    mermaid: true,
  },
};

export default config;
