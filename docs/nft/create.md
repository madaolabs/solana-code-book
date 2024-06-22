# Solana 创建 NFT

NFT(Non Fungible Token)是非同质化代币。
如何理解 NFT 可以从两个方面看：

- 从产品上看：Non Fungible 意味着独一无二和不可替代。
- 从技术上看: 不可分割，比如：你可以买 1 个 NFT，带不能买 0.01 个；而 Fungible Token 是可分割 Token，比如: 你可以买 0.01 个 Sol。

## NFT 的技术实现

Metaplex 提供了针对 NFT 的技术实现提供了 3 种方式:

1. Token Metadata: 比较传统的，较多人使用的实现方式
2. Bubblegum: 不采用账户存储，而是将数据存储在 Transaction 中的 NFT
3. Core: 一种节约存储空间的 NFT

### 本篇分析采用 Token Metadata 的技术实现方式{#TokenMetadata}

![image](/nft-create.png)

如上图所示，采用 `Token Metadata` 的方式创建 NFT 的步骤:

1. 创建 `Mint Account`.
2. 创建 `Metadata Account`.

基本流程和 Fungible Token 一样。

为了满足现实生活着更多的业务场景，Metaplex 增加了版本的概念，让 NFT 增加了授权使用的操作。我们看看是如何实现的:

![image](/nft-create-edition.png)

新增创建 `Master Edition Account` 和 `Edition Account`, 同时修改 `Mint Account` 中的字段 `Mint Authority` 和 `Freeze Authority` 为 `Edition Account`

`Master Edition Account` 中的 `Max Supply` 表示 `Edition Account` 的数量。从业务方向看相当于我授权给了哪些用户可以使用这些 NFT。

在创建`Edition Account`(无论是`Master Edition Account` 或者 `Edition Account`)时都会检查 `Mint Account` 的中的 Decimals 是否为 0, supply 是否为 1。所有如果我们查询某个 NFT，如果`Mint Authority`指向 `Edition Account`, 那么就正式这是一个 NFT。

## NFT 集合

通常一个系列的 NFT 会组成一个集合，`NFT集合` 的技术实现本身就是一个 NFT。根据`Metadata Account`中的 ConnectionDetails 属性判断是否是 `集合NFT` 还是 `普通NFT`

- 当 CollectionDetails 为 None 时表示 `普通NFT`，相反则为 `集合NFT`

`普通NFT` 和 `集合NFT` 的关联关系是根据`Metadata Account`中的 Collection 属性实现

- 当 `Collection` 设置为 `None` 时，意味着它不是集合的一部分
- 当 `Collection` 设置为 {Key, Verified}, Key 存储一个地址，指向`集合NFT`, Verified 是 bool 值，表示是否经过验证

更详细文档，请查看[文档](https://developers.metaplex.com/token-metadata/collections)
