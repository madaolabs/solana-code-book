# Solana Fungible Token

Tokens 是链上数字资产。通常在 dapp 中将产权(数字收藏品，积分等)使用 Tokens 替代。实现业务的去中心化，这个过程我们叫做代币化。常用的代币化有两种形式 fungible 和 non-fungible, 本节只设计 fungible token, non-fungible token(NFT)在后面的章节中学习。

Solana 上的代币通过 [Token Program](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/instruction.rs) 来创建和管理。我们可以从区块链浏览器中查看所有的 token 的 owner 都是 Token Program,比如: [USDT](https://solscan.io/token/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB)

## Token Program

Token Program 包含了 Token 的创建，转账等所有指令，所有的 token 的 owner 都是 Token Program. 你可以查看[所有指令](https://github.com/solana-labs/solana-program-library/blob/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program/src/instruction.rs)

![image](/token-program.svg)

以下给经常使用的指令:

- `InitializeMint`: 用于创建一个新的代币
- `InitializeAccount`: 用于创建持币的地址
- `MintTo`: 用于铸造币给某个 `Token Account`，并增加 `supply`
- `Transfer`: 用某个账户转帐给其他账户

## 发行币

![image](/mint-account.svg)
