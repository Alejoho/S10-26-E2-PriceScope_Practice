import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      jsdoc,
    },
    rules: {
      // Exige un comentario JSDoc breve solo en funciones, hooks y clases exportadas (API pública del módulo)
      // para mantener el código sostenible sin obligar a comentar variables o funciones internas obvias.
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
          require: {
            FunctionDeclaration: true,
            MethodDefinition: false,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          checkConstructors: false,
        },
      ],
      "jsdoc/require-description": [
        "warn",
        { contexts: ["FunctionDeclaration", "ClassDeclaration"] },
      ],
      // No obligamos a duplicar @param ni @returns porque TypeScript ya define los tipos
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
