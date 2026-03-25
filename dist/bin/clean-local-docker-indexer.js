#!/usr/bin/env node
import{execSync as o}from"child_process";import{dirname as e,join as i}from"path";import{fileURLToPath as t}from"url";var c=e(t(import.meta.url)),n=i(c,"..");try{process.chdir(n),o("pnpm run clean:local",{stdio:"inherit"})}catch(r){console.error("Failed to start local docker indexer:",r),process.exit(1)}
//# sourceMappingURL=clean-local-docker-indexer.js.map