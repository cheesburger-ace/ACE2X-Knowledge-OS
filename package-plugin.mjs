import {
  copyFileSync,
  existsSync,
  mkdirSync,
  rmSync
} from "node:fs";
import path from "node:path";

const outputFolder = path.resolve(
  "release",
  "ace2x-knowledge-os"
);

const pluginFiles = [
  "main.js",
  "manifest.json",
  "styles.css"
];

rmSync(outputFolder, {
  recursive: true,
  force: true
});

mkdirSync(outputFolder, {
  recursive: true
});

for (const file of pluginFiles) {
  if (!existsSync(file)) {
    console.error(`Required plugin file is missing: ${file}`);
    process.exit(1);
  }

  copyFileSync(
    path.resolve(file),
    path.join(outputFolder, file)
  );

  console.log(`Copied ${file}`);
}

console.log(
  `\nPlugin package created at:\n${outputFolder}`
);
