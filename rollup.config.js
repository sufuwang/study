import typescript from 'rollup-plugin-typescript2'
import path from 'path'

const commonBuildOptions = (prefix) => ({
  plugins: [
    typescript({
      tsconfig: path.resolve(__dirname, './tsconfig.json'),
      exclude: ['.js', '.ts']
    }),
  ],
  output: [
    {
      // 产物输出目录
      dir: `dist/${prefix}/es`,
      // 产物格式
      format: "esm",
    },
    {
      // 产物输出目录
      dir: `dist/${prefix}/cjs`,
      // 产物格式
      format: "commonjs",
    }
  ],
})

/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = [
  {
    ...commonBuildOptions('index'),
    input: ["./src/index.ts"],
  },
  {
    ...commonBuildOptions('main'),
    input: ["./src/main.ts"],
  }
];

export default buildOptions;