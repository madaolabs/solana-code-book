import { defineConfig } from "vitepress";
import { handleHeadMeta } from "./utils/handleHeadMeta";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Solana Code Book",
  lang: "zh-CN",
  head: [["link", { rel: "icon", href: "/solana-sol-logo.svg" }]],
  description: "Solana 入门教程",
  async transformHead(context) {
    return handleHeadMeta(context);
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "/" },
      { text: "教程", link: "/basic/blockchain" },
    ],
    search: {
      provider: "local",
    },

    sidebar: [
      {
        text: "基础篇",
        items: [
          { text: "区块链基础概念介绍", link: "/basic/blockchain" },
          { text: "本地环境搭建", link: "/basic/environment" },
          { text: "原生开发 Hello World", link: "/basic/native-hello" },
          { text: "Anchor开发 Hello World", link: "/basic/anchor-hello" },
          {
            text: "Solana 基础",
            items: [
              { text: "Solana 账户", link: "/basic/solana-basic-account" },
              { text: "Solana 交易", link: "/basic/solana-basic-tx" },
              { text: "Solana 费用", link: "/basic/solana-basic-fee" },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/madaolabs/solana-code-book" },
    ],
  },
});
