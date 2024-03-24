import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()]

});

// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     proxy: {
//       '/api': 'https://jsonplaceholder.typicode.com',
//     },
//   },
//   plugins: [react()]
// });



// // import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react';
// // export default defineConfig({
// //   server: {
// //     proxy: {
// //       '/api':'https://jukehost.co.uk/api',
// //     },
// //   },
// //   plugins: [react()],
// // });
