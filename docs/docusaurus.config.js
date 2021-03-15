/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "GraphQL-Utils",
  tagline: "Supercharge your GraphQL APIs.",
  url: "https://jenyus-org.github.io/graphql-utils",
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
        alt: "GraphQL-Utils",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
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
              label: "Installation",
              to: "docs/",
            },
            {
              label: "Getting Started",
              to: "docs/doc2/",
            },
            {
              label: "Usage",
              to: "docs/doc2/",
            },
            {
              label: "NestJS",
              to: "docs/doc2/",
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
