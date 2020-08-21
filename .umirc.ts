import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path:'/users',component: '@/pages/users'}
  ],
  proxy: {
    '/api': {
      'target': "http://public-api-v1.aspirantzhang.com",
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
});
