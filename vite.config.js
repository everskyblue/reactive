import { resolve } from "path";

/** @type {import('vite').UserConfig} */
export default {
    root: resolve(__dirname, 'example'),
    resolve: {
        alias: {
            'jsx': resolve(__dirname, 'core/src')
        }
    },
    esbuild: {
        jsxFactory: "Reactive.createElement",
        jsxFragment: "Reactive.Fragment"
    }
};
