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
  projectName: "jenyus-org.github.io", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "GraphQL-Utils",
      logo: {
        alt: "Jenyus Org",
        src: "img/jenyus_white.svg",
      },
      items: [
        {
          to: "docs/getting-started",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/jenyus-org/graphql-utils",
          label: "GitHub",
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
              label: "Utilities",
              to: "docs/resolve-field-map/",
            },
            {
              label: "Reference",
              to: "docs/field-map/",
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
              href: "https://github.com/jenyus-org/graphql-utils",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jenyus Org. Built with Docusaurus.`,
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
