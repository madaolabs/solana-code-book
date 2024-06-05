# Solana 基础概念

## 交易

对链上的 “增删改查” 是通过发送交易到链上实现的。交易包含一个或者多个指令，每一个指令表示执行某个链上合约的操作。

::: tip
一个交易的大小最大是 1232 Bytes
:::

## 发起 SOL 转账交易的例子

```typescript
// Define the amount to transfer
const transferAmount = 0.01; // 0.01 SOL

// Create a transfer instruction for transferring SOL from wallet_1 to wallet_2
const transferInstruction = SystemProgram.transfer({
  fromPubkey: sender.publicKey,
  toPubkey: receiver.publicKey,
  lamports: transferAmount * LAMPORTS_PER_SOL, // Convert transferAmount to lamports
});

// Add the transfer instruction to a new transaction
const transaction = new Transaction().add(transferInstruction);
```

上面的例子展示了“钱包”之间的转账，钱包的 owner 是 `System Program`. 所以从钱包转账 SOL 需要发送一个包含 System Program 转账指令的交易。

下图表示使用一条指令将 SOL 从发送方传输到接收方的交易。

![image](/sol-transfer.svg "SOL Transfer")

发送者帐户必须作为签名者 (is_signer) 包含在交易中，以批准扣除其 lamport 余额。发送方和收款方帐户都必须是可变的 (is_writable)，因为该指令会修改两个帐户的 lamport 余额。

## Transaction 的数据结构

Solana 交易的数据结构包括：

1. 签名：交易中包含的一组签名。
2. 消息：指令列表。

![image](/tx_format.png "tx format")

交易消息的结构包括：

- 消息头：指定签名者和只读帐户的数量。
- 账户地址：交易指令所需的账户地址数组。
- 最近的 Blockhash：充当交易的时间戳。
- 指令：要执行的指令数组。
  ![image](/legacy_message.png "legacy message")

### 消息头

消息头由 3 个 Bytes 组成：

1. 需要签名的账户个数
2. 只读并且需要签名的账户个数
3. 只读不需要签名的账户个数

![image](/message_header.png "message header")

### 账户地址

整个交易使用到的 accounts 数组，根据账号的权限排序，排序顺序是：

1. is_writable: true && is_signer: true
2. is_writable: false && is_signer: true
3. is_writable: true && is_signer: false
4. is_writable: false && is_signer: false

### 最近的 Blockhash

交易被执行时区块哈希的最大年龄为 150 个区块，如果比最新的 blockhash 老 150 个区块，交易过期不会执行。

### 指令

整个交易使用到的 instruction 数组，每一个指令由 3 部分组成

- Program ID: 使用到的 program 在 accounts 中的索引
- Compact array of account address indexes: 这个指令用到账户，指向 Account address 是一个索引数组
- Compact array of opaque u8 data：调用合约的数据

![image](/compact_array_of_ixs.png "compact_array_of_ixs")

### 一个交易的结构

```json
"transaction": {
    "message": {
      "header": {
        "numReadonlySignedAccounts": 0,
        "numReadonlyUnsignedAccounts": 1,
        "numRequiredSignatures": 1
      },
      "accountKeys": [
        "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
        "5snoUseZG8s8CDFHrXY2ZHaCrJYsW457piktDmhyb5Jd",
        "11111111111111111111111111111111"
      ],
      "recentBlockhash": "DzfXchZJoLMG3cNftcf2sw7qatkkuwQf4xH15N5wkKAb",
      "instructions": [
        {
          "accounts": [
            0,
            1
          ],
          "data": "3Bxs4NN8M2Yn4TLb",
          "programIdIndex": 2,
          "stackHeight": null
        }
      ],
      "indexToProgramIds": {}
    },
    "signatures": [
      "5LrcE2f6uvydKRquEJ8xp19heGxSvqsVbcqUeFoiWbXe8JNip7ftPQNTAVPyTK7ijVdpkzmKKaAQR7MWMmujAhXD"
    ]
  }
```

## Instruction 的数据结构

交易中的 Instruction 是由原始 instruction 转换后的，比如把 accounts 中会是一个索引指向。下面我们详细看看原始的 instruction 的数据结构:

- `Program address`: 哪一个 Program 会被调用
- `Accounts`: 指令涉及到的账户
- `Instruction Data`: 一个字节数组, 表示具体哪一个方法和参数

### Accounts 的数据结构

Accounts 表示每个 Instruction 需要的账户，数据结构是：

- `pubkey`: 账户的链上地址
- `is_signer`: 指定账户是否是交易中的签名者
- `is_writable`: 指定账户是否将被修改

这个信息被叫做：`AccountMeta`, 如下图:
![image](/accountmeta.svg "accountmeta")

类似数据库的锁，如果两个交易不包含两个相同的可写账户那么就可以同时执行。

### 示例指令结构

```json
{
  "keys": [
    {
      "pubkey": "3z9vL1zjN6qyAFHhHQdWYRTFAcy69pJydkZmSFBKHg1R",
      "isSigner": true,
      "isWritable": true
    },
    {
      "pubkey": "BpvxsLYKQZTH42jjtWHZpsVSa7s6JVwLKwBptPSHXuZc",
      "isSigner": false,
      "isWritable": true
    }
  ],
  "programId": "11111111111111111111111111111111",
  "data": [2, 0, 0, 0, 128, 150, 152, 0, 0, 0, 0, 0]
}
```
