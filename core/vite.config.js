import { resolve } from 'path'

export default {
    build: {
        target: "es2016",
        outDir: "dist",
        minify: false,
        lib: {
            entry: resolve(__dirname, "index.ts"),
            name: "reactive",
            fileName: "reactive",
            formats: ["es", "umd"],
        },
    },
    esbuild: {
        target: "es2016"
    }
};