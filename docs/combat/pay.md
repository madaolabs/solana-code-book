# 支付网关

本篇介绍一个支付网关的项目，类似于 AliPay(支付宝支付) 或者 WechatPay(微信支付) 。一个具体的业务场景是在电商网站中，用户购买商品，选择使用 “虚拟货币” 支付。商户可以提现到个人账户。
给本次项目命名为: `reelpay`

合约功能包括为：

1. 给每类 Token 创建资金池
2. 接受 SOL, SPL-Token 转入到资金池
3. 支持 SOL, SPL-Token 转出到指定地址

## 创建一个新项目

```shell
anchor init reelpay
```
