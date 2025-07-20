/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  try {
    nextConfig["experimental"] = {
      // NextJS 13.4.8 up to 14.1.3:
      // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
      // NextJS 14.1.3 to 14.2.11:
      swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],

      // NextJS 15+ (Not yet supported, coming soon)
    };
  } catch (error) {
    console.warn("Tempo devtools SWC plugin failed to load:", error.message);
    // Continue without the plugin if it fails to load
  }
}

module.exports = nextConfig;
