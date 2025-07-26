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
              label: "Features",
              link: "/introduction/features",
            }
	]
	},
	{
	  label: 'Getting Started',
	  autogenerate: { directory: 'getting-started' },
	},

	{
	  label: 'Entities',
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
	  autogenerate: { directory: 'workflows' },
	},
      ],
    }),

    partytown(),
  ],
});
