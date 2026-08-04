import { defineConfig } from 'orval';

export default defineConfig({
  mentora: {
    input: './openapi/openapi.yaml',
    output: {
      target: './src/shared/api/generated/endpoints.ts',
      schemas: './src/shared/api/generated/models',
      client: 'axios',
      formatter: 'prettier',
      mode: 'tags-split',
      mock: false,
    },
  },
});
