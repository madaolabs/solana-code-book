import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Solana Code Book",
  lang: "zh-CN",
  head: [["link", { rel: "icon", href: "/solana-sol-logo.svg" }]],
  description: "A VitePress Site",
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
          { text: "原生Hello World", link: "/basic/native-hello" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/madaolabs/solana-code-book" },
    ],
  },
});
