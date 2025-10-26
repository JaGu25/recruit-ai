import path from "path"
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        environment: "happy-dom",
        globals: true,
        setupFiles: "./src/setupTests.ts",
        css: true,
        coverage: {
            reporter: ["text", "html", "lcov"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: [
                "src/**/*.d.ts",
                "src/**/index.ts",
                "src/**/main.tsx",
                "src/**/router/**",
            ],
        },
    },
})
