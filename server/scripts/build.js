const process = require("child_process");
const fs = require('fs');
// 构建发布
process.execSync('npm run tsrpc-build');
console.log("构建完成")
// 复制配置文件
fs.copyFileSync("./ecosystem.config.js", "./dist/ecosystem.config.js")
fs.copyFileSync("./Dockerfile", "./dist/Dockerfile")
console.log("文件复制完成")