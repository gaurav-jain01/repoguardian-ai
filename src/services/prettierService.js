import prettier from "prettier";

export const prettify = async (filename, content) => {
  const config = await prettier.resolveConfig(filename);

  const formatted = prettier.format(content, {
    ...config,
    filepath: filename,
  });

  // If no change needed
  if (formatted === content) return null;

  return formatted; // return the fixed version
};
