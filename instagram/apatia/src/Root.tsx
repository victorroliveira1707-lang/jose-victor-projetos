import React from "react";
import { Composition, Series } from "remotion";
import { FPS, H, N, SEC, W } from "./kit";
import { SLIDES } from "./slides";

const D = SEC * FPS;
const Completo: React.FC = () => (
  <Series>
    {SLIDES.map((S, k) => (
      <Series.Sequence key={k} durationInFrames={D}><S /></Series.Sequence>
    ))}
  </Series>
);

export const Root: React.FC = () => (
  <>
    {SLIDES.map((S, k) => (
      <Composition key={k} id={`apatia-${String(k + 1).padStart(2, "0")}`} component={S} width={W} height={H} fps={FPS} durationInFrames={D} />
    ))}
    <Composition id="apatia-completo" component={Completo} width={W} height={H} fps={FPS} durationInFrames={D * N} />
  </>
);
