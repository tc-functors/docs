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
  prefetch: {
    prefetchAll: true,
  },
  integrations: [
    starlight({
      customCss: ["/src/tailwind.css"],
      title: 'tc',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/tc-functors/tc' }],
      sidebar: [
	{
	  label: 'Introduction',
	  autogenerate: { directory: 'introduction' },
	},
	{
	  label: 'Getting Started',
	  autogenerate: { directory: 'getting-started' },
	},
	{
	  label: 'Entities',
	  collapsed: false,
	  autogenerate: { directory: 'entities' },
	},
	{
	  label: 'Reference',
	  autogenerate: { directory: 'reference' },
	},
	{
	  label: 'Workflows',
	  autogenerate: { directory: 'workflows' },
	},
      ],
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    partytown(),
  ],
});
