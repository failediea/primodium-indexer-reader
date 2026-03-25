#!/usr/bin/env node
import{execSync as o}from"child_process";import{dirname as e,join as t}from"path";import{fileURLToPath as i}from"url";var c=e(i(import.meta.url)),n=t(c,"..");try{process.chdir(n),o("pnpm run start:local",{stdio:"inherit"})}catch(r){console.error("Failed to start local docker indexer:",r),process.exit(1)}
//# sourceMappingURL=local-docker-indexer.js.map