import { defineConfig } from "vitepress";
import { handleHeadMeta } from "./utils/handleHeadMeta";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Solana Code Book",
  lang: "zh-CN",
  head: [
    [
      "meta",
      {
        name: "keywords",
        content: "Solana 合约开发,Solana 入门教程,Solana Dapp",
      },
    ],
    ["link", { rel: "icon", href: "/solana-sol-logo.svg" }],
    [
      "script",
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-R9XMJYB91N",
        async: "true",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-R9XMJYB91N');`,
    ],
  ],
  description:
    "这是一本入门 Solana 的教程，涉及到前端开发，合约开发模块，除了理论基础，还有 Demo 的讲解。",
  async transformHead(context) {
    return handleHeadMeta(context);
  },
  // markdown: {
  //   toc: {
  //     level: [1, 2, 3],
  //   },
  // },
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
        text: "扫盲基础篇",
        collapsed: true,
        items: [
          { text: "区块链基础概念介绍", link: "/basic/blockchain" },
          { text: "本地环境搭建", link: "/basic/environment" },
        ],
      },
      {
        text: "Solana 基础",
        collapsed: true,
        items: [
          { text: "账户 (Account)", link: "/basic/solana-basic-account" },
          { text: "交易 (Transaction)", link: "/basic/solana-basic-tx" },
          { text: "费用 (Fee)", link: "/basic/solana-basic-fee" },
          { text: "合约 (Program)", link: "/basic/solana-basic-program" },
        ],
      },
      {
        text: "Solana 代币",
        collapsed: true,
        items: [{ text: "发行代币", link: "/spl-token/create" }],
      },
      {
        text: "Solana NFT",
        collapsed: true,
        items: [{ text: "创建 NFT", link: "/nft/create" }],
      },
      {
        text: "实战篇",
        collapsed: true,
        items: [
          { text: "Anchor开发 Hello World", link: "/basic/anchor-hello" },
          { text: "Anchor开发 支付网关", link: "/combat/pay" },
        ],
      },
      {
        text: "非必要篇",
        collapsed: true,
        items: [{ text: "原生开发 Hello World", link: "/basic/native-hello" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/madaolabs/solana-code-book" },
    ],
  },
});
