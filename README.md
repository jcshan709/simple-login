[Chinese Version](https://github.com/sjc0910/simple-login/blob/main/README_zh.md)
# Simple Login
A simple Node.js login system example.

# Build
1. Install typescript (if you have already, you can skip this step).
   ```
   npm install typescript --global
   ```
2. Run `npm install` to install dependencies.
3. Run `npm test` to execute.

# Config
config.json
```jsonc
{
  "server": { // Host and port to listen on
    "host": "0.0.0.0",
    "port": 8080
  },
  "database": {
    "outfile": ":memory:" // The file which to save database (":memory:" means save in memory)
  }
}
```