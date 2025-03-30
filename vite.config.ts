import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv, ProxyOptions } from 'vite';
import svgr from 'vite-plugin-svgr';

interface ProxyError extends Error {
  statusCode?: number;
}

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  console.log('🚀 Vite Config Mode:', mode);
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  // process.env = {...process.env, ...loadEnv(mode, process.cwd(), 'local')}
  console.log('mode', mode);
  const apiUrl = process.env.VITE_API_URL;
  console.log('📡 API URL:', apiUrl);
  const proxyConfig: ProxyOptions = {
    target: apiUrl,
    changeOrigin: true,
    rewrite: (path: string) => {
      const rewrittenPath = path.replace(/^\/api/, '');
      console.log('🔄 Rewriting path:', path, '->', rewrittenPath);
      return rewrittenPath;
    },
    secure: false, // Set to true in production
    ws: true, // Enable WebSocket proxying
    configure: (proxy, options) => {
      console.log('⚙️ Configuring proxy for mode:', mode);

      // Log only in development
      if (mode === 'development') {
        console.log('🛠️ Setting up development proxy handlers');

        proxy.on('proxyReq', (proxyReq, req, res) => {
          const { method, url, headers } = req;
          console.log('\n🔄 Outgoing Request:');
          console.log('URL:', apiUrl + (url?.replace(/^\/api/, '') || ''));
          console.log('Method:', method);
          console.log('Headers:', headers);

          // Add any custom headers if needed
          proxyReq.setHeader('X-Forwarded-Proto', 'http');
          proxyReq.setHeader('Origin', 'http://localhost:5173');
        });

        proxy.on('proxyRes', (proxyRes, req, res) => {
          const chunks: Buffer[] = [];

          console.log('\n✨ Incoming Response:');
          console.log('Status:', proxyRes.statusCode);
          console.log('Headers:', proxyRes.headers);

          proxyRes.on('data', (chunk) => {
            chunks.push(chunk);
          });

          proxyRes.on('end', () => {
            const body = Buffer.concat(chunks).toString('utf8');
            try {
              const parsedBody = JSON.parse(body);
              console.log('Response Body:', parsedBody);
            } catch (e) {
              console.log('Raw Response:', body);
            }
          });
        });

        proxy.on('error', (err: ProxyError, req, res) => {
          console.error('\n❌ Proxy Error:', err);

          // Send a proper error response to the client
          const statusCode = err.statusCode || 500;
          if (!res.headersSent) {
            res.writeHead(statusCode, {
              'Content-Type': 'application/json'
            });
          }

          const errorResponse = {
            status: statusCode,
            message: err.message || 'Proxy Error',
            timestamp: new Date().toISOString()
          };

          res.end(JSON.stringify(errorResponse));
        });
      } else {
        console.log('⚠️ Not in development mode, proxy logging disabled');
      }
    }
  };

  const config = {
    plugins: [react(), tailwindcss(), svgr()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    build: {
      outDir: './build'
    },
    server: {
      port: 3000,
      host: 'localhost',
      proxy: {
        '/api': proxyConfig
      }
    }
  };

  console.log('📦 Final proxy configuration:', JSON.stringify(proxyConfig, null, 2));
  return defineConfig(config);
};
