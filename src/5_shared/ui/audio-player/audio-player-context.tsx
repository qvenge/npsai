'use client';

import { createContext, useReducer, useState, useContext } from 'react';

export interface AudioState {
  src: string | null;
  isPlaying: boolean;
  // currentTime: number;
  // duration?: number;
}

const initialState = {
  src: null,
  isPlaying: false,
};

// const AudioPlayerContext = createContext<[AudioData, React.Dispatch<any>]>([{state: 'paused', currentTime: 0}, () => {}]);
const AudioStateContext = createContext<[AudioState, React.Dispatch<any>]>([initialState, () => {}]);
// const AudioMetaContext = createContext<AudioMeta | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  // const [audioData, setAudioData] = useReducer(audioPlayerReducer, null);
  // const [audioSrc, setAudioSrc] = useState<string | null>(null);
  // const [audioData, dispatch] = useReducer(audioPlayerReducer, {state: 'paused', currentTime: 0});
  const reducer = useReducer(audioPlayerReducer, initialState);

  return (
    <AudioStateContext.Provider value={reducer}>
      {/* <AudioMetaContext.Provider value={[audioMeta, setAudioMeta]}> */}
        {children}
      {/* </AudioMetaContext.Provider> */}
    </AudioStateContext.Provider>
  );
}

// export function useAudioMeta() {
//   const [audioData, dispatch] = useContext(AudioPlayerContext) ?? [null, () => {}];

//   return [
//     {
//       src: audioData.src,
//       duration: audioData?.duration,
//       currentTime: audioData?.currentTime,
//       state: audioData?.state,
//     },
//     (src: string) => dispatch({ type: 'SET_SOURCE', payload: src }) // setAudioSrc
//   ];
// }

/**
 * Custom hook to access and update the audio player state.
 *
 * This hook provides access to the current audio player state and a function to update it.
 * The state includes information about the audio source and its current playback state.
 *
 * @returns {[AudioState, (value: AudioState) => void]} An array containing the current audio state and a setter function.
 */
export function useAudioPlayer(): [AudioState, (action: Action) => void] {
  const [audioState, dispatch] = useContext(AudioStateContext);

  return [audioState, dispatch];
}

type Action = { type: 'PLAY' } |
  { type: 'PAUSE' } |
  // { type: 'SET_TIME', payload: number } |
  { type: 'SET_SOURCE', payload: { src: string | null, isPlaying?: boolean } };

function audioPlayerReducer(state: AudioState, action: Action): AudioState {
  switch (action.type) {
    case 'PLAY': {
      return {
        ...state,
        isPlaying: true,
      };
    }

    case 'PAUSE': {
      return {
        ...state,
        isPlaying: false,
      };
    }

    case 'SET_SOURCE': {
      const { src, isPlaying } = action.payload;

      return {
        src,
        isPlaying: src && isPlaying ? isPlaying : false,
      };
    }

    // case 'SET_TIME':
    //   return {
    //     ...state,
    //     currentTime: action.payload,
    //   }

    // default:
    //   return state;
  }
}

// type Action = { type: 'PLAY' } |
//   { type: 'PAUSE' } |
//   { type: 'SET_SOURCE', payload: string } |
//   { type: 'SET_TIME', payload: number };

// function audioPlayerReducer(state: AudioData, action: Action) {
//   switch (action.type) {
//     case 'PLAY':
//       return {
//         ...state,
//         state: 'playing',
//       };

//     case 'PAUSE':
//       return {
//         ...state,
//         state: 'paused',
//       };

//     case 'SET_SOURCE':
//       return {
//         src: action.payload,
//         currentTime: 0,
//         duration: 0,
//         state: 'paused',
//       };

//     case 'SET_TIME':
//       return {
//         ...state,
//         currentTime: action.payload,
//       }

//     default:
//       return state;
//   }
// }