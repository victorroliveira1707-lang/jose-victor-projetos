import React from 'react';
import {Composition, Series} from 'remotion';
import {DUR, FPS, TOTAL} from './kit';
import {slides} from './slides';

const Reel: React.FC = () => (
  <Series>
    {slides.map((S, i) => (
      <Series.Sequence key={i} durationInFrames={DUR}>
        <S />
      </Series.Sequence>
    ))}
  </Series>
);

export const Root: React.FC = () => (
  <>
    {slides.map((S, i) => (
      <Composition key={i} id={`PSP0${i + 1}`} component={S} durationInFrames={DUR} fps={FPS} width={1080} height={1350} />
    ))}
    <Composition id="PSPCompleto" component={Reel} durationInFrames={DUR * TOTAL} fps={FPS} width={1080} height={1350} />
  </>
);
