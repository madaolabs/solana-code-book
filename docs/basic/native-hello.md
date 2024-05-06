# 原生 Hello World 开发

Solana 的链上合约是由 Rust 开发，不熟悉的同学可以查阅[Rust 基础](./rust).

现在让我们通过构建和部署 Hello World! 程序来进行练习。

我们将在本地完成所有操作，包括部署到本地测试验证器。在开始之前，请确保你已经安装了 Rust 和 Solana CLI。如果你还没有安装，请参考概述中的说明进行设置。

## 1. 创建一个新的 Rust 项目

运行下面的命令 `cargo new --lib` 将新起一个项目。 项目命名为 `native-solana-hello`, 你也可以替换为你自己的喜欢的仓库名。

```bash
cargo new --lib native-solana-hello
```

运行下面的命令安装 `solana-program`

```bash
cargo add solana-program
```

修改 Cargo.toml 支持 lib

```toml
[package]
name = "native-solana-hello"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
solana-program = "1.18.12"

[lib]
crate-type = ["cdylib", "lib"]

```

## 2. 开始写代码

修改 src/lib.rs

```rust
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult{
    msg!("Hello, world!");

    Ok(())
}
```

## 3. 运行本地测试验证器

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

## 4. 构建和部署

我们现在准备好构建和部署我们的程序了。通过运行 `cargo build-sbf` 命令来构建程序。

```bash
cargo build-sbf
```

现在让我们部署我们的程序。部署从`cargo build-sbf`命令的输出`target/deploy/*.so`文件。

```bash
solana program deploy target/deploy/native_solana_hello.so
```

## 5. 启动日志监控

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
  "AAUHzTKVVrW5t1FMMpvqQ3txbTNTYN8Qpoz1PyQYJe1c" // 这里替换为部署合约的地址
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
