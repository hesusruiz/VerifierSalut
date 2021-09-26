export default {
  // config options
  root: "src",
  build: {
      minify: "esbuild",
      outDir: "../docs",
      emptyOutDir: true,
      assetsDir: "pieces",
      assetsInlineLimit: 7000
  }
}