import { build, context } from "esbuild";
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const watchMode = process.argv.includes("--watch");

const sharedConfig = {
  bundle: true,
  format: "iife",
  target: "chrome114",
  sourcemap: true,
  logLevel: "info"
};

const entryPoints = [
  {
    entryPoints: [path.join(rootDir, "src/background/index.ts")],
    outfile: path.join(distDir, "background.js")
  },
  {
    entryPoints: [path.join(rootDir, "src/content/index.ts")],
    outfile: path.join(distDir, "content.js")
  },
  {
    entryPoints: [path.join(rootDir, "src/popup/index.ts")],
    outfile: path.join(distDir, "popup.js")
  }
];

async function copyStaticFiles() {
  await mkdir(distDir, { recursive: true });
  await cp(path.join(rootDir, "static"), distDir, { recursive: true });
}

async function cleanDist() {
  await rm(distDir, { recursive: true, force: true });
}

async function runBuild() {
  await cleanDist();
  await copyStaticFiles();

  if (watchMode) {
    const contexts = await Promise.all(
      entryPoints.map((options) => context({ ...sharedConfig, ...options }))
    );
    await Promise.all(contexts.map((ctx) => ctx.watch()));
    console.log("Watching MirrorFit extension sources...");
    return;
  }

  await Promise.all(
    entryPoints.map((options) => build({ ...sharedConfig, ...options }))
  );
}

runBuild().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
