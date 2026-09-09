import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        include: [
            'test/**/*.{test,spec}.{js,ts}',
            'src/**/*.{test,spec}.{js,ts}',
        ],
        exclude: [
            'dist/**',
            'node_modules/**',
            'test/cards/arderial.test.js',
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
        },
    },
});
