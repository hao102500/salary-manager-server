
/**
 * 应用统一配置
 */
export default () => ({
  app: {
    // 运行环境
    nodeEnv: process.env.NODE_ENV || 'development',

    // 服务端口
    port: Number(process.env.PORT || 3000),

    // API 前缀
    apiPrefix: process.env.API_PREFIX || 'api',

    // API 版本
    apiVersion: process.env.API_VERSION || 'v1',

    // 跨域白名单
    corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
});
