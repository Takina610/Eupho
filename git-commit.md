## 6. 提交规范

### 6.1 提交格式

使用 Conventional Commits 的简化格式：

```text
<type>(<scope>): <中文或英文简述>
```

常用 `type`：

| type | 含义 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 缺陷修复 |
| `docs` | 仅文档修改 |
| `style` | 不影响逻辑的格式修改 |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `build` | 构建或依赖变更 |
| `ci` | CI/CD 配置变更 |
| `chore` | 其他维护 |
| `revert` | 回退提交 |

示例：

```text
feat(auth): 增加短信验证码登录
fix(order): 修复空商品列表导致的异常
docs(api): 补充本地调试说明
chore(deps): 升级 Spring Boot 至 3.5.1
```

重大不兼容变更须在类型后增加 `!`，并在正文中写明影响：

```text
feat(api)!: 调整登录接口响应结构
```

### 6.2 提交质量

- 每个提交应是一个完整、可解释的逻辑单元。
- 提交前必须检查 `git diff` 和 `git status`，确认未带入密钥、日志或无关文件。
- 提交说明描述“做了什么”，不要写 `update`、`修改一下`、`bug fix` 等模糊内容。
- 纯格式化、依赖升级和业务逻辑修改尽量分开提交。
- 不提交不能编译或明显破坏测试的中间状态到共享分支。
- 尚未推送的本地提交可整理；已推送且他人可能基于其开发的提交不得随意改写历史。

推荐提交前检查：

```bash
git status
git diff
git diff --staged
```