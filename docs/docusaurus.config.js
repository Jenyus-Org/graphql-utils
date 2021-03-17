/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "GraphQL-Utils",
  tagline: "Supercharge your GraphQL APIs.",
  url: "https://jenyus-org.github.io",
  baseUrl: "/graphql-utils/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "jenyus-org", // Usually your GitHub org/user name.
  projectName: "graphql-utils", // Usually your repo name.

  themeConfig: {
    navbar: {
      title: "GraphQL-Utils",
      logo: {
        alt: "Jenyus Org",
        src: "img/jenyus.svg",
        srcDark: "img/jenyus-white.svg",
      },
      items: [
        {
          to: "docs/getting-started",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/jenyus-org/graphql-utils/",
          label: "GitHub",
          position: "right",
        },
        {
          href: "http://jenyus.web.app/",
          label: "Jenyus",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "docs/getting-started/",
            },
            {
              label: "Recipes",
              to: "docs/recipes/field-maps/",
            },
            {
              label: "Reference",
              to: "docs/reference/interfaces/",
            },
            {
              label: "NestJS",
              to: "docs/nestjs/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/jenyus-org/graphql-utils/",
            },
            {
              label: "Jenyus",
              href: "http://jenyus.web.app/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jenyus Org. Built with Docusaurus.`,
    },
    /* googleAnalytics: {
      trackingID: "G-SGKJKYGQ0E",
      // Optional fields.
      anonymizeIP: true, // Should IPs be anonymized?
    }, */
    gtag: {
      trackingID: "G-SGKJKYGQ0E",
      // Optional fields.
      anonymizeIP: true, // Should IPs be anonymized?
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/jenyus-org/graphql-utils/edit/master/docs/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/jenyus-org/graphql-utils/edit/master/docs/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
