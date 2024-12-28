import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './app'), // Matches your `@/*` alias
        },
    },
    build: {
        outDir: 'build', // Matches your Next.js `distDir`
    },
});