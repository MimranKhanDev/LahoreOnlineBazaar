import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});

// // vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
//   optimizeDeps: {
//     include: [
//       'react-icons/cg',
//       'react-icons/ai',
//       'react-icons/md',
//       '@mui/lab',
//       'framer-motion',
//       'react-hot-toast',
//       'react-redux',
//       '@reduxjs/toolkit',
//       'react-helmet-async'
//     ]
//   },
//   server: {
//     port: 5173,
//     open: true
//   }
// })
