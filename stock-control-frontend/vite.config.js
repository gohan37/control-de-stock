export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8080'  // Aquí pones la URL de tu backend
    }
  }
};
