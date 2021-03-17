import playgroundEditorStyles from "@docusaurus/theme-live-codeblock/src/theme/Playground/styles.module.css";
import { getGraphQLResolveInfo } from "@jenyus-org/graphql-utils/dist/helpers";
import CodeBlock from "@theme/CodeBlock";
import usePrismTheme from "@theme/hooks/usePrismTheme";
import React from "react";
import { RiSignalTowerLine } from "react-icons/ri";
import { Editor } from "react-live";
import styles from "./styles.module.css";

const trimWhitespace = (str) => {
  str = str
    .split(/\r\n|\r|\n/)
    .filter((line) => !!line)
    .join("\n");

  const minWhitespace = Math.min(
    ...str.split(/\r\n|\r|\n/).map((line) => line.search(/\S|$/))
  );

  str = str
    .split(/\r\n|\r|\n/)
    .map((line) => line.slice(minWhitespace))
    .join("\n");

  return str;
};

export const Sandbox = ({ graphql, func, code }) => {
  const prismTheme = usePrismTheme();

  const trimmedCode = React.useMemo(() => trimWhitespace(code), [
    code,
    trimWhitespace,
  ]);

  const [editorState, setEditorState] = React.useState(trimWhitespace(graphql));

  const resolveInfo = React.useMemo(() => {
    try {
      return getGraphQLResolveInfo(editorState);
    } catch (e) {
      console.error(e);
    }
  }, [editorState]);

  const result = React.useMemo(
    () => (func && resolveInfo ? func(resolveInfo) : null),
    [func, resolveInfo]
  );

  return (
    <div className={styles.sandbox}>
      <div>
        <p className={styles.header}>
          <span>Query</span>
          <span className={styles.liveIndicator}>
            Live
            <RiSignalTowerLine className={styles.liveIndicatorIcon} />
          </span>
        </p>
        <Editor
          code={editorState}
          language="graphql"
          className={playgroundEditorStyles.playgroundEditor}
          onChange={setEditorState}
          theme={prismTheme}
        />
      </div>
      <div className={styles.codeBlockContainer}>
        <p className={styles.header}>Code</p>
        <CodeBlock className="ts">{trimmedCode}</CodeBlock>
      </div>
      {result !== undefined && (
        <div>
          <p className={styles.outputHeader}>Output</p>
          <CodeBlock className="json">
            {result !== null
              ? JSON.stringify(result, null, 2)
              : "Invalid GraphQL query"}
          </CodeBlock>
        </div>
      )}
      <br />
    </div>
  );
};
