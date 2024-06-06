# Solana 费用

在 Solana 中涉及到 2 种费用:

- 交易费用：支付给处理交易的节点
- 租金：用来支付数据保存在链上的费用

## 交易费用

每一笔发送到链上的交易，在被节点处理之前，会先扣除交易费，当交易被确认，费用则被支付给链上。其中 50% 给节点，另外 50% 则销毁。如果交易在处理过程中发生了问题，则所有数据将会回滚，但是交易费用依旧会被扣除，因为节点已经执行了你的交易。

交易费用由两部分组成：

- `基本费用`: 交易中的每一个签名支付 5000 lamports.
- `优先费用`: 支付在执行过程中使用的计算资源，比如 CPU/GPU.

### 优先费用

Solana 中将使用的计算资源的最小单位称为计算单元(`compute unit`, 简称为`CU`), 优先费用 = 计算单元的数量 \* 计算单元的单价.

计算单元的数量在 Solana 中有一个最大的限制，限制在 1,400,000 个 CU. 发送交易时如何没有特定设置，每笔交易则最大设置为 200,000 个 CU. 每笔交易可以使用
`SetComputeUnitLimit` 指令设置计算单元的数量, 但是不能超过 1,400,000 个 CU.

计算单元的单价默认是 0，意味着优先费用是 0. 每笔交易可以通过 `SetComputeUnitPrice` 指令设置计算单元的单价。

以下是 Rust 和 Javascript 设置价格的案例

```rust
let instruction = ComputeBudgetInstruction::set_compute_unit_limit(300_000);
let instruction = ComputeBudgetInstruction::set_compute_unit_price(1);
```

```javascript
const instruction = ComputeBudgetProgram.setComputeUnitLimit({
  units: 300_000,
});

const instruction = ComputeBudgetProgram.setComputeUnitPrice({
  microLamports: 1,
});
```

:::INFO
如果用户给的优先费用大于真实使用的，大于的费用会返回给发起方。
:::

## 租金

租金的作用是支付账户在链上的存储费用，所有的账户的余额(lamport)应该不小于`最小免租余额`, 可以调用[`getMinimumBalanceForRentExemption`](https://solana.com/zh/docs/rpc/http/getminimumbalanceforrentexemption)获取`最小租金`。

除了账户的 lamport 变成 0 (关闭账户)，其他情况账户的 lamport 不能小于`最小租金`，否则交易会失败。
