import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import globals from "rollup-plugin-node-globals";
import { terser } from "rollup-plugin-terser";
import html from "@rollup/plugin-html";
import json from "@rollup/plugin-json";

export default {
  input: ["./src/index.tsx"],
  output: {
    dir: "dist",
    format: "iife"
  },
  plugins: [
    json(),
    typescript(),
    resolve({
      preferBuiltins: true,
      exportConditions: ["solid"],
      extensions: [".ts", ".tsx"]
    }),
    commonjs(),
    globals(),
    babel({ babelHelpers: "bundled", extensions: [".ts", ".tsx"] }),
    terser(),
    html({
      meta: [{ name: "robots", content: "noindex,nofollow", charset: "utf-8" }],
      title: "5-0.knoblau.ch"
    })
  ]
};
