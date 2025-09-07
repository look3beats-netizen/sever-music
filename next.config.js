/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Разрешаем картинки из Supabase Storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '**',
      },
    ],
    // (Можно вместо remotePatterns указать точный домен:)
    // domains: ['bswszgxjpdvdaapypurf.supabase.co'],
  },

  // Косметика: уберёт ворнинг из @supabase/realtime-js в dev
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      ws: false,
    }
    return config
  },

  // Иногда помогает со сборкой этих пакетов
  transpilePackages: ['@supabase/supabase-js', '@supabase/realtime-js'],
}

module.exports = nextConfig
