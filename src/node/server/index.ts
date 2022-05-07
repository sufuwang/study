import connect from "connect";
import { optimize } from "../optimizer/index";
import { blue, green } from "picocolors";
import { transformMiddleware } from "./middlewares/transform";
import { ModuleGraph } from "../ModuleGraph";
import { createPluginContainer, PluginContainer } from "../pluginContainer";
import { resolvePlugins } from "../plugins";
import { indexHtmlMiddware } from "./middlewares/indexHtml";
import { staticMiddleware } from "./middlewares/static";
import { createWebSocketServer } from "../ws";
import chokidar, { FSWatcher } from "chokidar";
import { bindingHMREvents } from "../hmr";
import { Plugin } from "../plugin";

export interface ServerContext {
  root: string;
  moduleGraph: ModuleGraph;
  pluginContainer: PluginContainer;
  app: connect.Server;
  ws: { send: (data: any) => void; close: () => void };
  watcher: FSWatcher;
  plugins: Plugin[];
}

// 启动 vite 打包
export async function startDevServer() {
  const app = connect();  // 开启一个 http 服务
  const root = process.cwd(); // 项目根目录
  const startTime = Date.now();
  const plugins = resolvePlugins(); // 所有 plugin
  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url)); // 缓存
  const pluginContainer = createPluginContainer(plugins); // plugin 上下文
  const watcher = chokidar.watch(root, {
    ignored: ["**/node_modules/**", "**/.git/**"],
    ignoreInitial: true,
  });

  // WebSocket 对象
  const ws = createWebSocketServer(app); // 开启 ws 服务, 暴露出 send 和 close 方法
  // 开发服务器上下文
  const serverContext: ServerContext = {
    root,
    app,
    moduleGraph,
    pluginContainer,
    ws,
    watcher,
    plugins,
  };
  bindingHMREvents(serverContext);
  for (const plugin of plugins) {
    if (plugin.configureServer) {
      await plugin.configureServer(serverContext);
    }
  }

  // 核心编译逻辑
  app.use(transformMiddleware(serverContext));

  // 入口 HTML 资源
  app.use(indexHtmlMiddware(serverContext));

  // 静态资源
  app.use(staticMiddleware());

  app.listen(3000, async () => {
    await optimize(root); // 依赖预构建
    console.log(
      green("🚀 No-Bundle 服务已经成功启动!"),
      `耗时: ${Date.now() - startTime}ms`
    );
    console.log(`> 本地访问路径: ${blue("http://localhost:3000")}`);
  });
}
