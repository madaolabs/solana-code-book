# Solana Fungible Token

Tokens 是链上数字资产。通常应用于将产权(数字收藏品，积分等)使用 Tokens 替代。实现业务的去中心化，这个过程叫做代币化。常用的代币化有两种形式 fungible 和 non-fungible, 本节只设计 fungible token, non-fungible token(NFT)在后面的章节中学习。

Solana 上的代币通过 [Token Program](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program) 来创建和管理。我们可以从区块链浏览器中查看所有的 token 的 owner 都是 Token Program,比如: [USDT](https://solscan.io/token/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB)

:::INFO
有两个版本的 Token Program , 旧版的 [Token Program](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program) 和新版本的 [Token Extensions Program](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program-2022)，官方鼓励使用[Token Extensions Program](https://github.com/solana-labs/solana-program-library/tree/b1c44c171bc95e6ee74af12365cb9cbab68be76c/token/program-2022), 因为目前大多数知名的 Token 都是采用的旧版 `Token Program`，本节讲解只涉及 `Token Program`的方案。
:::

## Token Program

`Token Program` 包含了 Token 的创建，转账等所有指令，你可以查看[所有指令](https://github.com/solana-labs/solana-program-library/blob/master/token/program/src/instruction.rs)

![image](/token-program.svg)

以下给经常使用的指令:

- `InitializeMint`: 用于创建一个新的代币
- `InitializeAccount`: 用于创建持币的地址
- `MintTo`: 用于铸造币给某个 `Token Account`，并增加 `supply`
- `Transfer`: 用某个账户转帐给其他账户

## 发行代币(简称发币)

每一个人都可以根据自己的业务需求发币，在 Solana 链中发币就是创建一个 `Mint Account`. 在 Mint Account 中包含了:

- `Supply`: 代币总数量
- `Decimals`: 代币的精度
- `Mint authority`: 拥有铸造代币(增发)权限的账户
- `Freeze authority`: 拥有冻结某个账户转账代币权限的账户

![image](/mint-account.svg)

下面是 Mint Account 的全部细节:

```rust
pub struct Mint {
    /// Optional authority used to mint new tokens. The mint authority may only
    /// be provided during mint creation. If no mint authority is present
    /// then the mint has a fixed supply and no further tokens may be
    /// minted.
    pub mint_authority: COption<Pubkey>,
    /// Total supply of tokens.
    pub supply: u64,
    /// Number of base 10 digits to the right of the decimal place.
    pub decimals: u8,
    /// Is `true` if this structure has been initialized
    pub is_initialized: bool,
    /// Optional authority to freeze token accounts.
    pub freeze_authority: COption<Pubkey>,
}
```

以上数据结构，没有包含名称，符号，头像等数据。这些数据要存在哪里呢？这就要提到[Metaplex](https://www.metaplex.com)。
Metaplex 提供了 `Token Metadata` 的一套标准。将名称，符号，头像等数据存储在另一个账户 `Metadata Account`。
对 `Metadata Account` 的管理使用[Token Metadata Program](https://docs.metaplex.com/programs/token-metadata/overview)完成的。

![image](/token-metadata-account.png)

这里有两个关键点:

1. `Metadata Account` 的 Owner 是 `Token Metadata Program`
2. `Metadata Account` 使用通过 `Mint Account` 派生的 PDA 账户

`Metadata Account` 中的 `Token Standard`字段表示 `Mint Account` 的类型，可写的值有五种:

- `0` / `NonFungible`: A non-fungible token with a Master Edition.
- `1` / `FungibleAsset` (1): A token with metadata that can also have attributes, sometimes called Semi-Fungible.
- `2` / `Fungible` (2): A token with simple metadata.
- `3` / `NonFungibleEdition` (3): A non-fungible token with an Edition account (printed from a Master edition).
- `4` / `ProgrammableNonFungible` (4): A special NonFungible token that is frozen at all times to enforce custom authorization rules.

本节我们使用都的是 `Fungible` 这种类型。

上图的 URI 字段指向了链下数据，链下数据格式请看[标准格式](https://developers.metaplex.com/token-metadata/token-standard)

## 使用 JS 发行代币

现在假设我们要发行一个 `Code` 代币。我们使用 Metaplex 的 JSSDK 进行 coding。

```typescript
import bs58 from "bs58";
import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";

const secretKey = ""; // 钱包私钥

const umi = createUmi("https://api.devnet.solana.com");

const userWallet = umi.eddsa.createKeypairFromSecretKey(bs58.decode(secretKey));

const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
  name: "Cook",
  symbol: "Cook",
  uri: "", // 链下uri
};

const amount = 1_000_000_000000000n;
const decimals = 9;

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplCandyMachine());

createAndMint(umi, {
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals,
  amount,
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible,
})
  .sendAndConfirm(umi)
  .then(() => {
    console.log("Successfully minted 1 million tokens (", mint.publicKey, ")");
  })
  .catch((err: any) => {
    console.log("Send Error===>", err);
  });
```
