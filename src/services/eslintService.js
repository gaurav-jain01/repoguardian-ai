import { ESLint } from "eslint";

export const runESLint = async (filename, content) => {
  const eslint = new ESLint({
    useEslintrc: true,
    fix: false, // YOU DO NOT WANT AUTO FIX HERE
  });

  const results = await eslint.lintText(content, { filePath: filename });

  return results[0].messages;
};
