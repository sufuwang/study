import { readFile } from "fs-extra";
import { Plugin } from "../plugin";
import { ServerContext } from "../server";
import { getShortName } from "../utils";

export function cssPlugin(): Plugin {
  let serverContext: ServerContext;
  return {
    name: "m-vite:css",
    configureServer(s) {
      serverContext = s;
    },
    load(id) {
      if (id.endsWith(".css")) {
        return readFile(id, "utf-8");
      }
    },
    async transform(code, id) {
      if (id.endsWith(".css")) {
        // 包装成 JS 模块
        const jsContent = `
import { createHotContext as __vite__createHotContext } from "/@vite/client";
import.meta.hot = __vite__createHotContext("/${getShortName(
          id,
          serverContext.root
        )}");
import { updateStyle, removeStyle } from "/@vite/client"
  
const id = "${id}";
const css = "${code.replace(/\n/g, "")}";

updateStyle(id, css);
import.meta.hot.accept();
export default css;
import.meta.hot.prune(() => removeStyle(id));`.trim();
        return {
          code: jsContent,
        };
      }
      return null;
    },
  };
}
