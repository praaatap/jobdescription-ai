import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                { src: "src/background/background.ts", dest: "" },
                { src: "src/content/content.ts", dest: "" },
                { src: "public/icon.png", dest: "" }
            ]
        })
    ],
    build: {
        rollupOptions: {
            input: {
                main: "index.html",
                background: "src/background/background.ts",
                content: "src/content/content.ts"
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
                        return '[name].js';
                    }
                    return 'assets/[name]-[hash].js';
                }
            }
        }
    }
});
