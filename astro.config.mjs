// astro.config.ts
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel/serverless";
import partytown from "@astrojs/partytown";
import compress from "astro-compress";

export default defineConfig({
  integrations: [UnoCSS(), svelte(), partytown(), compress()],
  output: "server",
  adapter: vercel()
});