import { resolvePath } from "@/core/utils/paths.mjs";
import path from "path";
import CONST from "@/core/CONST.mjs";
import fs from "fs";

export default (req, res) => {
  const pathWithoutCore = req.url.replace("/core/", "");
  const filePath = resolvePath(`@/coreBrowserLogic/${pathWithoutCore}.mjs`);
  const ext = path.extname(filePath);
  const contentType = CONST.mimeTypes[ext] || "application/javascript";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(CONST.consoleMessages.server.notFound);
    } else {
      const code = data
        .toString()
        .replace(/(["'])@\/core\/browserLogic\//g, "$1/core/")
        .replace(/["@']@\/modules\//g, '"/module/');
      res.writeHead(200, { "Content-Type": contentType });
      res.end(code);
    }
  });
};
