import fs from "fs";
import { resolvePath } from "@/core/utils/paths.mjs";
import { toKebabCase } from "@/core/utils/stringUtils.mjs";

/**
 * Loads the HTML content of a specific page.
 *
 * @param {string} pageName - The name of the page to load.
 * @returns {Promise<string|false>} - The HTML content or false on failure.
 */
async function loadPage(pageName) {
  "use strict";

  const pathSegments = pageName.split("/");

  for (let i = 1; i <= pathSegments.length; i++) {
    const subPath = pathSegments.slice(0, i).join("/");
    const pagePath = resolvePath(`@/pages/${subPath}.html`);

    try {
      return await fs.promises.readFile(pagePath, "utf-8");
    } catch (err) {
      if (i === pathSegments.length) {
        console.msg("pages.failedToLoad", pageName, err);
        return false;
      }
    }
  }

  return false;
}

/**
 * Generates full HTML by injecting page content into the app shell,
 * replacing PascalCase component tags with kebab-case,
 * and adding script tags for components.
 *
 * @param {string} pageName - The name of the page to render.
 * @returns {Promise<string|false>} - The full HTML content or false on failure.
 */
async function generateAppHtml(pageName) {
  "use strict";

  const appHtmlPath = resolvePath("@/app.html");
  try {
    let appHtml = await fs.promises.readFile(appHtmlPath, "utf-8");
    let pageContent = await loadPage(pageName);

    if (!pageContent) {
      return false;
    }

    const componentTags = new Set(["App"]); // zawsze dołącz App jako komponent bazowy
    const tagRegex =
      /<([A-Z][a-zA-Z0-9]*)[^>]*>.*?<\/\1>|<([A-Z][a-zA-Z0-9]*)[^>]*\/>/g;
    let match;

    while ((match = tagRegex.exec(pageContent)) !== null) {
      const pascalTag = match[1] || match[2];
      componentTags.add(pascalTag);
    }

    componentTags.forEach((tag) => {
      const kebabTag = tag === "App" ? "app-root" : toKebabCase(tag); // specjalny przypadek dla App

      const selfClosingTagRegex = new RegExp(`<${tag}([^>]*)/>`, "g");
      appHtml = appHtml.replace(
        selfClosingTagRegex,
        `<${kebabTag}$1></${kebabTag}>`,
      );

      appHtml = appHtml.replace(
        new RegExp(`<${tag}([^>]*)>`, "g"),
        `<${kebabTag}$1>`,
      );
      appHtml = appHtml.replace(new RegExp(`</${tag}>`, "g"), `</${kebabTag}>`);
    });

    appHtml = appHtml.replace(
      /<app([^>]*)>(.*?)<\/app>/is,
      `<app$1>${pageContent}</app>`,
    );

    let scriptTags = fs.readFileSync(
      resolvePath("@/core/scripts.html"),
      "utf8",
    );
    componentTags.forEach((tag) => {
      scriptTags += `<script src="component/${tag}"></script>\n`;
    });

    appHtml = appHtml.replace("</body>", `${scriptTags}</body>`);

    return appHtml;
  } catch (err) {
    console.msg("pages.htmlGeneratingError", err);
    return false;
  }
}

export { generateAppHtml };
