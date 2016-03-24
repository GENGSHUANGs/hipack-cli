# hipack-cli
Hipack command tool


Usage :

Install
```
npm install hipack-cli -g
```

Start development mode 
```
mkdir demo && cd demo 
hipack start
// 如果初次使用，工具会向github拉取最新的工作环境(https://github.com/GENGSHUANGs/hipack)，这个过程中可能由于网络原因造成拉取失败，请使用 --force 重试
hipack start --force
```

Build production release 
```
hipack build --release
```
