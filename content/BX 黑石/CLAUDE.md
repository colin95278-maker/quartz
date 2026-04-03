---
permalink: bx-hei-shi/claude
---
# 我的偏好设置

## 语言规范：专业术语标注中文

在所有输出中，凡遇到**英文专业术语、缩写、产品名称、基金名称**，第一次出现时必须在后面括号内附上中文解释。例如：

- BREIT（黑石房地产收益信托基金）
- BCRED（黑石私人信贷基金）
- FRE（费用相关收入）
- DE（可分配收益）
- AUM（管理资产规模）
- PE（私募股权）
- NAV（净资产价值）
- CMBS（商业抵押贷款支持证券）
- ETF（交易所交易基金）
- IPO（首次公开募股）

同一术语在同一篇文档/对话中后续出现时不需重复标注。我是投资/商业领域英语基础薄弱的初学者，请确保每个专业词汇都能被轻松理解。

---

## BX 情报简报：必查信息源与盲区防护清单

### 问题背景
2026-03-20 简报遗漏了 BCRED 以 $825 亿资产池发行 CLO 的重大正向信号，原因是信息收集框架偏向主流财经媒体和股票侧信息，系统性忽略了**债券/结构化融资市场**的操作性数据。

### 强制检查规则：每次生成 BX 简报时，必须额外搜索以下信息类别

#### A. 资本市场操作（最高优先级盲区）
当 BCRED 或 BREIT 面临流动性压力时，**必须主动追问并搜索**：

| 检查项 | 搜索关键词示例 |
|--------|--------------|
| CLO / ABS / 结构化产品发行 | `BCRED CLO issuance 2026`, `Blackstone private credit CLO`, `BCRED securitization` |
| 信贷额度（credit facility）安排 | `BCRED credit facility revolving`, `Blackstone credit line` |
| 底层资产评级变动 | `BCRED Moody's S&P rating`, `Blackstone private credit rating action` |
| 债券/票据发行定价 | `Blackstone bond issuance spread`, `BCRED note offering` |
| 资产出售/组合调整 | `BCRED asset sale portfolio`, `Blackstone credit portfolio disposition` |

**专业信源**（主流媒体通常不覆盖，必须专门搜索）：
- LCD / Pitchbook Leveraged Commentary（银团贷款/CLO 市场权威）
- Creditflux（结构化信贷专业媒体）
- Bloomberg Fixed Income / Terminal 级数据
- IFR（International Financing Review，国际融资评论）
- GlobalCapital（全球资本市场媒体）
- 搜索语法：`Blackstone CLO site:pitchbook.com`, `BCRED securitization site:bloomberg.com`, `Blackstone private credit CLO pricing`

#### B. 同业融资端对比（识别相对优势/劣势的关键维度）
不仅要比赎回率，还要比**融资能力**：

| 同业 | 检查项 |
|------|--------|
| BlackRock HPS / HLEND | 是否也在发 CLO？定价利差多少？ |
| Blue Owl / OBDC | 有没有新的融资安排？ |
| Apollo / Ares | 结构化融资进展？ |
| KKR | 信贷产品融资端动态？ |

#### C. 自我审计问题清单（简报完成前必须过一遍）
每次生成简报时，在最终提交前用以下 5 个问题自审：

1. **融资端**：BCRED/BREIT 在融资端有什么新动作？（CLO、信贷额度、票据发行）
2. **评级端**：评级机构对 BX 旗下基金有没有新的评级行动？
3. **定价端**：债券/贷款二级市场定价有没有异常变动？
4. **监管端**：SEC 或其他监管机构有没有新的针对性行动？
5. **同业对比**：同行在做什么 BX 没做的事？BX 在做什么同行没做的事？

**如果某个问题搜索后确实没有新信息，在简报中明确写"已检查，无新动态"，而不是直接省略——省略意味着遗漏，明确写"无"意味着已覆盖。**

---

## 术语速查（简报常用）

- CLO（Collateralized Loan Obligation，抵押贷款凭证）：将一堆贷款打包成证券出售给投资者
- ABS（Asset-Backed Securities，资产支持证券）：以资产池为抵押发行的证券
- bps（basis points，基点）：1bps = 0.01%，用于衡量利差
- Credit Facility（信贷额度）：银行提供的可随时提取的贷款额度
- Securitization（证券化）：将资产打包成可交易证券的过程
- Spread（利差）：债券收益率与基准利率的差额，反映信用风险定价
