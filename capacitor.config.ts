import type { CapacitorConfig } from '@capacitor/cli'
// 注册页等后端网页必须留在 App 的 WebView 内打开；不加入白名单时 Capacitor 会用系统浏览器打开。
const configuredApiOrigin = process.env.VITE_API_ORIGIN
if (!configuredApiOrigin) throw new Error('VITE_API_ORIGIN is required before copying native release assets')
const apiHost = new URL(configuredApiOrigin).hostname
const config: CapacitorConfig = {
  appId: 'com.jiuhe.app',
  appName: '九合创投',
  webDir: 'dist',
  server: {
    androidScheme: process.env.VITE_ANDROID_SCHEME === 'http' ? 'http' : 'https',
    allowNavigation: [apiHost],
  },
}
export default config
