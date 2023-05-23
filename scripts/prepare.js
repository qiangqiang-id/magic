// import fs from 'fs';
// import path from 'path';
import { spawnSync } from 'child_process';

spawnSync('npx husky install');

spawnSync('git config core.hooksPath .husky');

// const root = process.cwd();
// const configExamplePath = path.resolve(root, './config/config.example.json');
// const configPath = path.resolve(root, './config/config.json');

// if (!fs.existsSync(configPath)) {
//   fs.copyFileSync(configExamplePath, configPath);
//   console.log('[prepare]创建`config/config.json`配置文件完毕');
// }
