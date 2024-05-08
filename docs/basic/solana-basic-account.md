# Solana 基础概念

## 账户

在 Solana 中，无论是钱包数据，合约代码还是合约数据等等，所有的数据存储都存储在账户中。每个账户存储上限是 **10** MB。每一个账户都有唯一的地址。

### 账户的数据结构

下图展示了 AccountInfo 中的部分重要的字段，其他字段可以查看 [AccountInfo](https://github.com/solana-labs/solana/blob/27eff8408b7223bb3c4ab70523f8a8dca3ca6645/sdk/program/src/account_info.rs#L19)

![image](/accountinfo.svg "AccountInfo")

Solana 中的每一个账户都包含以下字段:

- `data`: 根据账户的不同功能，存储不同的数据。存储格式是字节数组。如果账户是合约，则存储账户合约代码，如果账户是代币，则存储代币数据。
- `executable`: 表示是否是合约，数据结构是一个 boolean 值。
- `lamports`: 表示账户的余额，1 SOL = 10^9 lamports。
- `owner`: 表示账户的 owner 是谁，在 Solana 中只有 owner 可以修改 data 或者 减少 lamports。任何人都可以增加这个账户的 lamports。

在 Solana 中我们根据 `AccountInfo` 中 `data` 的不同，大致把 AccountInfo 分为 3 中类型

1. Native Programs
2. Sysvar Accounts
3. Custom Programs

### Native Programs

Native Programs 包括多个账户，提供了 Solana 的核心功能，可以点击查看所有的[Native Programs](https://docs.solanalabs.com/runtime/programs)，在开发合约中通常用到 `System Program` 和 `BPF Loader`

#### System Program

`System Program` 提供了几种重要的功能，比如：

- `创建新账户`: 只有 `System Program` 可以创建新账户
- `空间分配`: 设置 Account 中的 `data` 字段的字节大小
- `分配 Custom Programs 的 owner`：一旦创建账户后，可以重新分配 `owner` 给不同的账户

在 Solana 中，每一个钱包地址都是一个 `owner` 为 `System Program` 的账户, `lamports` 字段表示这个钱包账户的余额

![image](/system-account.svg "AccountInfo")

::: info
只有 owner 是`System Program`的账户才可以作为交易的 fee payers
:::

#### BPFLoader Program

BPF Loader 是所有 custom programs 账户的 owner，它的核心功能是部署，升级和执行 custom programs

### Sysvar Accounts

Sysvar Accounts 是一些特殊的账户，提供了链的状态数据，比如 `Clock`, `EpochSchedule` 等等

### Custom Programs

Custom Programs 包含 `Program Account` 和 `Data Account` 两种类型的账户。

#### Program Account

Program Account 可以简单理解为在 Account 的 `data` 字段存储的是合约代码，同时 `executable` 字段为 true，更详细的内容[查看](https://solana.com/zh/docs/core/accounts#program-account)

![image](/program-account-simple.svg "program-account-simple")

#### Data Account

`Program Account` 是无状态的。所以合约涉及的状态存储在另一个账户下，这就是`Data Account`，大致的关系图如下

![image](/data-account.svg "data-account")

注意只有 `System Program` 可以创建账户。

Program Account 创建 Data Account 的流程分为 2 步：

1. `System Program` 创建账户，然后再把 `Data Account` 的 `owner` 设置为其他 `Program Account`
2. 调用 `Program Account` ，初始化 `Data Account` 的数据
