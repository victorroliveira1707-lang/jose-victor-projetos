import React from "react";
import { Composition, Series } from "remotion";
import { DUR, FPS, H, W } from "./kit";
import { SLIDES } from "./slides";

const Completo: React.FC = () => (
  <Series>
    {SLIDES.map((S, k) => (
      <Series.Sequence key={k} durationInFrames={DUR[k] * FPS}><S /></Series.Sequence>
    ))}
  </Series>
);

export const Root: React.FC = () => (
  <>
    {SLIDES.map((S, k) => (
      <Composition key={k} id={`apatia-${String(k + 1).padStart(2, "0")}`} component={S} width={W} height={H} fps={FPS} durationInFrames={DUR[k] * FPS} />
    ))}
    <Composition id="apatia-completo" component={Completo} width={W} height={H} fps={FPS} durationInFrames={DUR.reduce((a, b) => a + b, 0) * FPS} />
  </>
);
