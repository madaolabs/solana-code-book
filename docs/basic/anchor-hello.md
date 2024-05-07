# Anchor Hello World 开发

Anchor 是 Solana 的合约的开发框架, 开发语言是 rust, 不熟悉的同学可以查阅[Rust 基础](https://www.rust-lang.org/learn).

现在让我们通过构建和部署 Hello World! 程序来进行练习。

我们将在本地完成所有操作，包括部署到本地测试验证器。在开始之前，请确保你已经安装了 Rust 和 Solana CLI。如果你还没有安装，请参考概述中的说明进行设置。

## 1. Anchor 安装

这里是`Anchor`的[安装官方指南](https://www.anchor-lang.com/docs/installation).

按照步骤安装好 `Anchor`。安装完成后执行`anchor --version`检测时候完成.

```sh
anchor --version
anchor-cli 0.29.0
```

执行命令`anchor --help`学习常用命令

```sh
anchor --help
```

## 2. 创建 Anchor 项目

执行`anchor init anchor-solana-hello`

```sh
anchor init anchor-solana-hello
```

## 3. 开始 coding

修改`programs/anchor-solana-hello/src/lib.rs`

```rust
use anchor_lang::prelude::*;

declare_id!("2vVfyxWYozJE5ePd7rnq9Wjd2gqiufzq6oh84WckKipE");

#[program]
pub mod anchor_solana_hello {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello, world!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
```

## 4. 运行本地测试验证器

在编写好你的程序之后，让我们确保我们的`Solana CLI`配置指向本地主机，使用`solana config set --url`命令。

```bash
solana config set --url localhost
```

接下来，使用`solana config get`命令检查`Solana CLI`配置是否已更新。

```bash
solana config get
```

最后，运行本地测试验证器。在一个单独的终端窗口中运行`solana-test-validator`命令。只有当我们的`RPC URL`设置为`localhost`时才需要这样做。

```bash
solana-test-validator
```

:::tip
这里一定要注意 ⚠️，`solana-test-validator` 这个命令启动的是 solana 的本地测试验证器。
:::

## 5. 构建和部署

我们现在准备好构建和部署我们的程序了。通过运行 `cargo build-sbf` 命令来构建程序。

```bash
cargo build-sbf
```

现在让我们部署我们的程序。部署从`cargo build-sbf`命令的输出`target/deploy/*.so`文件。

```bash
solana program deploy target/deploy/native_solana_hello.so
```

## 6. 启动日志监控

在我们调用程序之前，打开一个单独的终端并运行`solana logs`命令。这将允许我们在终端中查看程序日志。

```bash
solana logs <PROGRAM_ID>
```

## 6. 调用合约

在项目的根目录创建`test`目录，然后在`test`目录中执行`npm init`,并且安装`@solana/web3.js`

```bash
mkdir test
cd test
npm init
npm install @solana/web3.js
```

### 编写调用代码

新建文件 `test/index.js`, 其中`PROGRAM_ID`替换为部署合约的地址

```javascript
const Web3 = require("@solana/web3.js");

const PROGRAM_ID = new Web3.PublicKey(
  "2vVfyxWYozJE5ePd7rnq9Wjd2gqiufzq6oh84WckKipE" // 这里替换为部署合约的地址
);
const connection = new Web3.Connection("http://localhost:8899", "confirmed");

async function initializeKeypair() {
  const signer = Web3.Keypair.generate();
  const airdropSignature = await connection.requestAirdrop(
    signer.publicKey,
    Web3.LAMPORTS_PER_SOL
  );

  const latestBlockhash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  const newBalance = await connection.getBalance(signer.publicKey);
  console.log("New balance is", newBalance / Web3.LAMPORTS_PER_SOL, "SOL");
  return signer;
}

async function callHelloworld() {
  const signer = await initializeKeypair();
  const transaction = new Web3.Transaction();
  const instruction = new Web3.TransactionInstruction({
    keys: [],
    programId: PROGRAM_ID,
  });
  transaction.add(instruction);
  const signature = await Web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [signer]
  );
  console.log(`Transaction: ${signature}`);
}

callHelloworld();
```
