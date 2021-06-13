#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const { spawnSync } = require("child_process")
const logger = require("../lib/consoleLogger")

/**
 * Scaffolds out the project (at a given directory) using the boilerplate files in this application's `lib/` folder.
 *
 * @function
 * @name scaffoldProject
 */
function scaffoldProject() {
  const args = process.argv.slice(2)
  const cwd = process.cwd()

  try {
    if (!args.length) {
      throw new TypeError("Must include a name for the project directory")
    }

    const [projectFolderName] = args
    if (fs.existsSync(projectFolderName) && fs.readdirSync(projectFolderName).length) {
      throw new Error(`Project folder already exists: '${projectFolderName}'`)
    }

    const folderParts = path.resolve(projectFolderName).replace(cwd, "").split(path.sep).filter(Boolean)

    let currentDir = cwd
    folderParts.forEach(folder => {
      if (!fs.existsSync(path.resolve(currentDir, folder))) {
        fs.mkdirSync(path.resolve(currentDir, folder))
      }
      currentDir = path.resolve(currentDir, folder)
    })

    const templateDir = path.resolve(__dirname, "../lib")

    let currentTemplateDir = templateDir
    fs.readdirSync(templateDir).forEach(fileOrFolder => {
      if (fs.statSync(fileOrFolder).isDirectory()) {
        currentTemplateDir = path.resolve(currentTemplateDir, fileOrFolder)
        fs.mkdirSync(path.resolve(currentDir, currentTemplateDir))
      } else {
        const content = fs.readFileSync(path.resolve(currentTemplateDir, fileOrFolder), "utf8")
        fs.writeFileSync(path.resolve(currentDir, fileOrFolder), content)
      }
    })

    const {
      author: _a,
      version: _v,
      license: _l,
      bin: _b,
      ...pkgJson
    /* eslint-disable-next-line global-require */
    } = require("../package.json")
    pkgJson.name = projectFolderName
    pkgJson.private = true
    pkgJson.description = "TODO"

    fs.writeFileSync(path.resolve(currentDir, "package.json"), JSON.stringify(pkgJson, null, 2))

    const { status } = spawnSync("npm", ["install"], { cwd: currentDir, stdio: "inherit" })

    if (status) {
      throw new Error("Scaffolding failed‼️")
    }

    logger.info(`🚀 Finished scaffolding out the project at: '${projectFolderName}'`)

    process.exit(0)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

scaffoldProject()
