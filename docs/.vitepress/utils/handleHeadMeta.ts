import { type HeadConfig, type TransformContext } from "vitepress";

// 处理每个页面的元数据
export function handleHeadMeta(context: TransformContext) {
  const { description, title, relativePath } = context.pageData;
  // 增加Twitter卡片
  const ogUrl: HeadConfig = [
    "meta",
    {
      property: "og:url",
      content: "https://learn-solana.dewall.xyz",
    },
  ];
  const ogTitle: HeadConfig = [
    "meta",
    { property: "og:title", content: "Solana 开发教程" },
  ];
  const ogDescription: HeadConfig = [
    "meta",
    { property: "og:description", content: description || context.description },
  ];
  const ogImage: HeadConfig = [
    "meta",
    {
      property: "og:image",
      content: "https://learn-solana.dewall.xyz/solana-share-card.png",
    },
  ];
  const ogSiteName: HeadConfig = [
    "meta",
    {
      property: "og:site_name",
      content: "https://learn-solana.dewall.xyz",
    },
  ];
  const ogType: HeadConfig = [
    "meta",
    {
      property: "og:type",
      content: "website",
    },
  ];
  const twitterCard: HeadConfig = [
    "meta",
    { name: "twitter:card", content: "summary_large_image" },
  ];
  const twitterImage: HeadConfig = [
    "meta",
    {
      name: "twitter:image",
      content: "https://learn-solana.dewall.xyz/solana-share-card.png",
    },
  ];
  const twitterImageAlt: HeadConfig = [
    "meta",
    {
      name: "twitter:image:alt",
      content: "@0xCaptainApr",
    },
  ];
  const twitterDescription: HeadConfig = [
    "meta",
    {
      name: "twitter:description",
      content: description || context.description,
    },
  ];
  const twitterSite: HeadConfig = [
    "meta",
    {
      name: "twitter:site",
      content: "@0xCaptainApr",
    },
  ];
  const twitterTitle: HeadConfig = [
    "meta",
    {
      name: "twitter:title",
      content: "Solana 开发教程",
    },
  ];

  const twitterHead: HeadConfig[] = [
    ogUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogSiteName,
    ogType,
    twitterCard,
    twitterDescription,
    twitterImage,
    twitterSite,
    twitterImageAlt,
    twitterTitle,
  ];

  return twitterHead;
}

export function addBase(relativePath: string) {
  const host = "https://solana-learn.dewall.xyz";
  if (relativePath.startsWith("/")) {
    return host + relativePath;
  } else {
    return host + "/" + relativePath;
  }
}
