const rollup = require("rollup")
const typescript = require("rollup-plugin-typescript2")
const path = require('path')

/**
 * @type { Array<import('rollup').InputOptions> }
 */
const inputOptions = [
  {
    id: 'index',
    input: "./src/index.ts",
    plugins:[
      typescript({
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
        exclude: ['.js', '.ts']
      }),
    ],
  },
  {
    id: 'main',
    input: "./src/main.ts",
    plugins:[
      typescript({
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
        exclude: ['.js', '.ts']
      }),
    ],
  }
]

/**
 * @type { Array<import('rollup').OutputOptions> }
 */
const outputOptionsList = (path) => ([
  {
    dir: `dist/${path}/es`,
    format: 'es',
    sourcemap: true,
  },
  {
    dir: `dist/${path}/cjs`,
    format: 'cjs',
    sourcemap: true,
  }
])

async function build() {
  let bundle
  let buildFailed = false
  try {
    for (const { id, ...inputOption } of inputOptions) {
      bundle = await rollup.rollup(inputOption)
      for (const outputOptions of outputOptionsList(id)) {
        await bundle.generate(outputOptions)
        await bundle.write(outputOptions)
      }
    }
  } catch (error) {
    buildFailed = true
    console.error(error)
  }
  if (bundle) {
    await bundle.close()
  }
  process.exit(buildFailed ? 1 : 0)
}

build()