import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    root: resolve(__dirname, 'test'),
    resolve: {
        alias: {
            'jsx': resolve(__dirname, 'src')
        }
    },
    esbuild: {
        jsxFactory: "Reactive.createElement",
        jsxFragment: "Reactive.Fragment",
    }
});
