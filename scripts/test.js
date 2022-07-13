const fs = require("fs")
const path = require("path")
const { MultiSelect } = require("enquirer")
const pkgDir = path.resolve(__dirname, "../packages")
const packages = fs.readdirSync(pkgDir).filter(dir => !dir.includes("."))

const selectPackages = async () => {
	const prompt = new MultiSelect({
		name: "packages",
		message: "select release packages!",
		choices: packages.concat("all")
	})
	let selectedPackages = await prompt.run()
	if (selectedPackages.length <= 0)
		throw Error("Select at least one release package")
	if (selectedPackages.includes("all")) {
		selectedPackages = packages
	}
}

selectPackages()

