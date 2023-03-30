import { readdirSync } from 'fs';
import { join, resolve } from 'path'

function getExcludeFile() {
    const pluggablesDirectoryPath = resolve(__dirname, "core/src/jsx-runtime");
    const filesInPluggablesDirectory = readdirSync(pluggablesDirectoryPath);
    return filesInPluggablesDirectory.map(file => join(pluggablesDirectoryPath, file));
}

export default {
    build: {
        target: "es2016",
        outDir: "dist",
        minify: true,
        lib: {
            entry: resolve(__dirname, "core/index.ts"),
            name: "reactive",
            fileName: "reactive",
            formats: ["es", "umd"],
        },
        rollupOptions: {
            external: getExcludeFile(),
        },
    },
    esbuild: {
        target: "es2016",
    },
};