import { AppRoutes } from "./route/AppRoutes";
import { css } from "@linaria/core";

import fontEotThin from "@asset/font/pancetta_serif_prothin-webfont.eot";
import fontWoff2Thin from "@asset/font/pancetta_serif_prothin-webfont.woff2";
import fontWoffThin from "@asset/font/pancetta_serif_prothin-webfont.woff";
import fontTtfThin from "@asset/font/pancetta_serif_prothin-webfont.ttf";
import fontSvgThin from "@asset/font/pancetta_serif_prothin-webfont.svg";

const appStyle = css`
  :global() {
    @font-face {
      font-family: "pancetta_serif_prothin";
      src: url(${fontEotThin});
      src:
        url(${fontEotThin}?#iefix) format("embedded-opentype"),
        url(${fontWoff2Thin}) format("woff2"),
        url(${fontWoffThin}) format("woff"),
        url(${fontTtfThin}) format("truetype"),
        url(${fontSvgThin}#pancetta_serif_prothin) format("svg");
      font-weight: normal;
      font-style: normal;
    }

    html,
    body {
      font-family:
        "pancetta_serif_prothin", "HelveticaNeue-Light", "Helvetica Neue Light",
        "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
      height: 100%;
      min-height: 100%;
      background-color: black;
      margin: 0;
    }
  }
`;

function App() {
  return (
    <div className={appStyle}>
      <AppRoutes />
    </div>
  );
}

export default App;
