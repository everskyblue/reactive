import { resolve } from "path";

/** @type {import('vite').UserConfig} */
export default {
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
};
