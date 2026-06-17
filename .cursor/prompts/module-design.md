# 模块设计 Prompt（先设计，不写代码）

按 Dining Ops Platform 项目规则，为 **[模块名]** 做模块设计，**不要写代码**。

## 请输出

1. 页面路由与布局（`admin` / `screen` / `blank`）
2. 组件拆分（页面 / 业务组件 / 通用组件）
3. Pinia Store 职责与状态字段
4. Mock 数据结构
5. 与已有模块的联动点（路由跳转、Store、MQTT 等）
6. **明确不实现的边界**

## 约束

- 不更换技术栈
- 不删除已有 docs 与设计约束
- 保持餐饮连锁运营业务主线

## 参考

- `docs/01-product-design.md` 对应章节
- `src/views/` 下同类页面结构
