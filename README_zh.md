[English Version](https://github.com/sjc0910/simple-login/blob/main/README.md)
# Simple Login
这是一个用Node.js做的登录系统示例。

# 构建
如果你在中国境内，建议使用cnpm
```
npm install cnpm --global
```
1. 安装 typescript（如果你已经有，跳过这一步）
   ```
   (c)npm install typescript --global
   ```
2. 执行`(c)npm install`以安装所需的依赖
3. 用`npm test`命令运行

# 配置
config.json
```json
{
  "server": { // 监听的主机ip和端口
    "host": "0.0.0.0",
    "port": 8080
  },
  "database": {
    "outfile": ":memory:" // 保存数据库的文件（设为":memory:"以在内存中保存）
  }
}
```