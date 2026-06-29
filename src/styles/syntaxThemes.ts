import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export const highContrastLight = {
  ...oneLight,
  'code[class*="language-"]': {
    ...oneLight['code[class*="language-"]'],
    color: "#172033",
  },
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    color: "#172033",
  },
  comment: { color: "#667085", fontStyle: "italic" },
  prolog: { color: "#667085" },
  cdata: { color: "#667085" },
  punctuation: { color: "#344054" },
  keyword: { color: "#8B1A8F", fontWeight: 600 },
  builtin: { color: "#8B1A8F", fontWeight: 600 },
  function: { color: "#175CD3" },
  string: { color: "#237A2B" },
  char: { color: "#237A2B" },
  number: { color: "#A14400" },
  boolean: { color: "#A14400" },
  operator: { color: "#175CD3" },
};
