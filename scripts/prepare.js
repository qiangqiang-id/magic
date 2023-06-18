import { spawnSync } from 'child_process';

spawnSync('npx husky install');

spawnSync('git config core.hooksPath .husky');
