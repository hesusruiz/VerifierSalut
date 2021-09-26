export default {
  // config options
  root: "src",
  build: {
      minify: "esbuild",
      outDir: "../docs",
      emptyOutDir: true,
      assetsInlineLimit: 7000
  }
}