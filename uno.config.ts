// uno.config.ts
import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts } from 'unocss'
export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: 'fontshare', // default provider
      fonts: {
        // these will extend the default theme
        sans: 'tanker',
        mono: ['Erode'],
        // custom ones  
      },
      
    },),	
    presetIcons(),presetTypography(),

  ],
})
