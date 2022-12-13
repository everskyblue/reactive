import { resolve } from "path";

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
