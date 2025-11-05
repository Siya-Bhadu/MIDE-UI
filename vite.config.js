import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * @type {import('vite').UserConfig}
 * WebSocket proxying for ROS bridge integration 
 * we will have to change the target when deploying the app
 */
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward ws://localhost:5173/ros to ws://localhost:9090
      '/ros': {
        target: 'ws://localhost:9090',
        ws: true,
        changeOrigin: true,
        // optional pathRewrite if you prefer exact pass-through
        // rewrite: (path) => path.replace(/^\/ros/, '')
      },
    },
  },
})