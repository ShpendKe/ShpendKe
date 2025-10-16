import React from "react";
import Giscus from "@giscus/react";
import { useColorMode } from "@docusaurus/theme-common";

export default function Comments(): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <div>
      <Giscus
        id="comments"
        repo="shpendke/shpendke"
        repoId="R_kgDOGG_o1w"
        category="Announcements"
        categoryId="DIC_kwDOGG_o184Cwru2"
        mapping="pathname"
        strict="0"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="top"
        theme={colorMode === "dark" ? "dark_tritanopia" : "light_tritanopia"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}