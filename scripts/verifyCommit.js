// eslint-disable-next-line
const chalk = require("chalk")
const msgPath = process.env.GIT_PARAMS
const msg = require("fs").readFileSync(msgPath, "utf-8").trim()

const commitRE =
	/^(revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
	console.log()
	console.error(
		`  ${chalk.bgRed.white(" ERROR ")} ${chalk.red(
			`invalid commit message format.`
		)}\n\n` +
			chalk.red(
				`  Proper commit message format is required for automated changelog generation. Examples:\n\n`
			) +
			`    ${chalk.green(`feat(array): add uniq function`)}\n` +
			`    ${chalk.green(`fix(string): should return type (close #55)`)}\n\n`
	)
	process.exit(1)
}
