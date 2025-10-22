// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { collapsibleFrames } from "/src/plugins/collapsible-frames";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";

// https://astro.build/config
export default defineConfig({
  site: "https://tc-functors.org",
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  prefetch: {
    prefetchAll: true,
  },
       build: {
         assets: 'assets'
	   },
  integrations: [
    starlight({
      title: 'tc',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/tc-functors/tc' }],
      sidebar: [
	{
	  label: 'Introduction',
	  items: [
            {
              label: "About",
              link: "/",
            },
            {
              label: "Concepts",
              link: "/introduction/concepts",
            },
            {
              label: "Features",
              link: "/introduction/features",
            },
            {
              label: "FAQ",
              link: "/introduction/faq"
            }
	]
	},
	{
	  label: 'Getting Started',
	  collapsed: true,
	   items: [
            {
              label: "Installation",
              link: "/getting-started/installation",
            },
            {
              label: "Hello World",
              link: "/getting-started/hello-world",
            }
	]

	},

	{
	  label: 'Examples',
	  collapsed: true,
	   items: [
            {
              label: "Rest API",
              link: "/examples/rest-api",
            },
            {
              label: "Evented",
              link: "/examples/evented",
            },
            {
              label: "Chat",
              link: "/examples/chat",
            },
            {
              label: "GQL Subscription",
              link: "/examples/progress-tracker",
            }
	]
	},

	{
	  label: 'Entities',
	  collapsed: true,
	  collapsed: true,
	  items: [
            {
              label: "Functions",
              link: "/entities/functions",
            },
            {
              label: "Events",
              link: "/entities/events",
            },
            {
              label: "Routes",
              link: "/entities/routes",
            },
            {
              label: "Mutations",
              link: "/entities/mutations",
            },
            {
              label: "Queues",
              link: "/entities/queues",
            },
            {
              label: "Pages",
              link: "/entities/pages",
            },
            {
              label: "Channels",
              link: "/entities/channels",
            },
            {
              label: "States",
              link: "/entities/states",
            },
	  ]
	},
	{
	  label: 'Reference',
	  collapsed: true,
	  autogenerate: { directory: 'reference' },
	},
	{
	  label: 'Workflows',
	  collapsed: true,
	   items: [
            {
              label: "Develop",
              link: "/workflows/develop",
            },
            {
              label: "Develop (Remote)",
              link: "/workflows/remote",
            },
            {
              label: "Release",
              link: "/workflows/release",
            },
            {
              label: "Changes",
              link: "/workflows/changes",
            },
            {
              label: "Audit",
              link: "/workflows/audit",
            },
            {
              label: "Praxis (UI)",
              link: "/workflows/praxis",
            }
	   ]
	},

	{
	  label: 'Integrations',
	  collapsed: true,
	  autogenerate: { directory: 'integrations' },
	},
	{
	  label: 'News',
	  collapsed: true,
	  autogenerate: { directory: 'news' },
	},
	{
	  label: 'Internals',
	  collapsed: true,
	   items: [
            {
              label: "Overview",
              link: "/internals/overview",
            },
            {
              label: "Compiler",
              link: "/internals/compiler",
            },
            {
              label: "Composer",
              link: "/internals/composer",
            }
	   ]
	},

      ],
    }),

    partytown(),
  ],
});
