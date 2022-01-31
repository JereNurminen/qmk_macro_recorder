import React, { useEffect } from "react";
import { useState } from "react";
import "./app.scss";
import { keycodeMapping } from "./mapping";

interface KeyEvent {
  key: string;
  action: "up" | "down";
}

// Mapping to QMK macro steps, described here: https://docs.qmk.fm/#/feature_macros?id=using-macros-in-json-keymaps
interface MacroStep {
  action: "down" | "up" | "tap";
  keycodes: string[]; // TODO: Better typing (union of accepted keycodes?)
}

const mapToQMKKeycode = (key: string) => {
  const isLetter = new RegExp("[a-zA-Z0-9]").test(key);
  return isLetter
    ? key.toUpperCase()
    : keycodeMapping[key] ?? `key "${key}" NOT SUPPORTED YET, MAP MANUALLY`;
};

const parseKeyEvents = (events: KeyEvent[]) => {
  const parse = (
    eventsLeft: KeyEvent[],
    parsedEvents: MacroStep[],
    previousEvent?: KeyEvent
  ) => {
    if (!eventsLeft.length) {
      return parsedEvents;
    }

    const currentEvent = eventsLeft[0];

    if (previousEvent === undefined) {
      return parse(eventsLeft.slice(1), parsedEvents, currentEvent);
    } else if (
      previousEvent.key === currentEvent.key &&
      previousEvent.action === currentEvent.action
    ) {
      return parse(eventsLeft.slice(1), parsedEvents, currentEvent);
    } else if (
      currentEvent.key === previousEvent.key &&
      currentEvent.action === "up" &&
      previousEvent.action === "down"
    ) {
      return parse(eventsLeft.slice(1), [
        ...parsedEvents,
        { action: "tap", keycodes: [mapToQMKKeycode(currentEvent.key)] },
      ]);
    } else if (previousEvent.key !== currentEvent.key) {
      return parse(eventsLeft.slice(1), [
        ...parsedEvents,
        {
          action: previousEvent.action,
          keycodes: [mapToQMKKeycode(previousEvent.key)],
        },
        {
          action: currentEvent.action,
          keycodes: [mapToQMKKeycode(currentEvent.key)],
        },
      ]);
    }
    throw "Something went wrong";
  };

  return parse(events, []);
};

export const App = () => {
  const [keys, setKeys] = useState<MacroStep[]>([]);
  const [recordedKeys, setRecordedKeys] = useState<KeyEvent[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setRecordedKeys([]);
    setKeys([]);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setKeys(parseKeyEvents(recordedKeys));
  };

  const copyMacro = () => {
    window.navigator.clipboard.writeText(JSON.stringify(keys, null, 2));
  };

  useEffect(() => {
    const onKeyDown = (key: KeyboardEvent) => {
      setRecordedKeys([...recordedKeys, { key: key.key, action: "down" }]);
    };

    const onKeyUp = (key: KeyboardEvent) => {
      setRecordedKeys([...recordedKeys, { key: key.key, action: "up" }]);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [recordedKeys]);

  return (
    <>
      <h1>QMK Macro Recorder</h1>
      <p>
        Documentation on the format{" "}
        <a
          target="_blank"
          href="https://docs.qmk.fm/#/feature_macros?id=using-macros-in-json-keymaps"
        >
          here
        </a>
        . Assumes ISO_UK layout, output on other layouts can be wrong. Recorded
        macro does not yet include any delays, add them by hand if needed.
      </p>
      <div className="button-container">
        {!isRecording ? (
          <button onClick={startRecording}>Record</button>
        ) : (
          <button onClick={stopRecording}>Stop recording</button>
        )}
        {keys.length ? (
          <button onClick={copyMacro}>Copy macro to clipboard</button>
        ) : null}
      </div>
      {keys.length ? (
        <>
          <code>{`${JSON.stringify(keys, null, 2)}`}</code>
        </>
      ) : null}
    </>
  );
};
