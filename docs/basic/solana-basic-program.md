# Solana 合约

在 Solana 生态中，合约被称为 `Program`, 比如: `System Program`, `BPFLoader Program` 等等。

区别于`ETH`中的合约，Solana 的合约的执行代码和数据是区别在不同的账户的。数据存储在 PDA 账户中。关于 PDA，本篇后面会详细说明。

## 写合约

Solana 的合约使用 Rust 编程语言，通常写合约有两种方式:

- [`Anchor`](https://solana.com/developers/guides/getstarted/intro-to-anchor): 写合约的框架。
- [`Native Rust`](https://solana.com/developers/guides/getstarted/intro-to-native-rust): 不使用框架，原生直接写。

## PDA

PDA 是 Program Derived Address 的简称，是派生账户。首先我们一下 js 代码先看看派生账户如何获得:

```javascript
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("11111111111111111111111111111111");
const seed = "helloWorld";

const [PDA, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from(seed)],
  programId
);

console.log(`PDA: ${PDA}`); // PDA: 46GZzzetjCURsdFPb7rcnspbEMnCBXe9kpjrsZAkKb6X
console.log(`Bump: ${bump}`); // Bump: 254
```

使用`@solana/web3.js`提供的方法 Public.findProgramAddressSync 的方法，我们得到了一个 PDA 的地址。
并且这个方法每次执行的结果都是一样的。在我们的使用过程中，programId 是固定的，意味着只要 seed 不变，我们每次都可以算出固定的地址。下面的图解释了 PDA 的计算逻辑：

![image](/pda-derivation.svg "pda-derivation")

在上面的计算过程中，你可能已经发现了，返回值中没有私钥，这和我们所知道的钱包地址不一样。是的，PDA 账户是没有私钥。
所以 PDA 账户不能发起交易，当我们需要修改 PDA 中的数据时，是通过 PDA 账户的 Owner 签名修改。
