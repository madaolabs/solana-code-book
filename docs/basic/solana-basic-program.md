# Solana 合约

在 Solana 生态中，合约被称为 `Program`, 比如: `System Program`, `BPFLoader Program` 等等。

在[`Solana 账户`](/basic/solana-basic-account.html) 中我们知道`AccountInfo`结构中的`Executable`字段表示是否是合约。区别于`ETH`中的合约，Solana 的合约的执行代码和数据是区别在不同的账户的。数据存储在 PDA 账户中。关于 PDA，本篇后面会详细说明。

## 写合约

Solana 的合约使用 Rust 编程语言，通常写合约有两种方式:

- [`Anchor`](https://solana.com/developers/guides/getstarted/intro-to-anchor): 写合约的框架。
- [`Native Rust`](https://solana.com/developers/guides/getstarted/intro-to-native-rust): 不使用框架，原生直接写。
