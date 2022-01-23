const path = require("path")
const chokidar = require("chokidar")
const fse = require("fs-extra");


const target = (process.argv[2] || path.join(__dirname, "src")).trim()
const to = (process.argv[3] || path.join(__dirname, "dist")).trim()

function watch_and_copy() {
  const dist_existed = fse.existsSync(to);
  console.log("target: ", target)
  if (!dist_existed) {
    fse.mkdirSync(to);
  }
  console.info(`${'- * - '.repeat(8)} start watching ... \n\n`)
  const watcher = chokidar.watch(target, { ignored: /(^|[\/\\])\../, });
  watcher.on("add", (fp) => {
    const fdp = path.join(to, fp);
    console.log("copy ", fp, fdp)

    fse.ensureDirSync(path.dirname(fdp))
    if (fse.statSync(fp).isDirectory()) {
      fse.copySync(fp, fdp, { overwrite: true })
      console.info("\tDirectory ", fp, "has been added");
    } else {
      fse.copyFileSync(fp, fdp)
      console.info("\tFile ", fp, "has been added");
    }
  });
  watcher.on("change", (fp) => {
    const fdp = path.join(to, fp);
    fse.ensureDirSync(path.dirname(fdp))
    if (fse.statSync(fp).isFile()) {
      fse.copyFileSync(fp, fdp)
      console.info("\tFile ", fp, "has been change");
    }
  });
}

watch_and_copy();