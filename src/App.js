"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
exports.__esModule = true;
exports.App = void 0;
var react_1 = require("react");
var react_2 = require("react");
var parseKeyEvents = function (events) {
  var parse = function (eventsLeft, parsedEvents, previousEvent) {
    if (!eventsLeft.length) {
      return parsedEvents;
    }
    var currentEvent = eventsLeft[0];
    console.log(previousEvent, currentEvent);
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
      return parse(
        eventsLeft.slice(1),
        __spreadArray(
          __spreadArray([], parsedEvents, true),
          [{ action: "tap", keycodes: [currentEvent.key] }],
          false
        )
      );
    } else if (previousEvent.key !== currentEvent.key) {
      return parse(
        eventsLeft.slice(1),
        __spreadArray(
          __spreadArray([], parsedEvents, true),
          [
            { action: previousEvent.action, keycodes: [previousEvent.key] },
            currentEvent,
          ],
          false
        )
      );
    }
    console.error("Whoops!");
  };
  return parse(events, []);
};
var App = function () {
  var _a = (0, react_2.useState)([]),
    keys = _a[0],
    setKeys = _a[1];
  var _b = (0, react_2.useState)([]),
    recordedKeys = _b[0],
    setRecordedKeys = _b[1];
  var _c = (0, react_2.useState)(false),
    isRecording = _c[0],
    setIsRecording = _c[1];
  var startRecording = function () {
    setRecordedKeys([]);
    setKeys([]);
    setIsRecording(true);
  };
  var stopRecording = function () {
    setIsRecording(false);
    setKeys(parseKeyEvents(recordedKeys));
    console.log({ keys: keys });
  };
  (0, react_1.useEffect)(
    function () {
      var onKeyDown = function (key) {
        console.log(key.key, "down");
        setRecordedKeys(
          __spreadArray(
            __spreadArray([], recordedKeys, true),
            [{ key: key.key, action: "down" }],
            false
          )
        );
      };
      var onKeyUp = function (key) {
        console.log(key.key, "up");
        setRecordedKeys(
          __spreadArray(
            __spreadArray([], recordedKeys, true),
            [{ key: key.key, action: "up" }],
            false
          )
        );
      };
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
      return function () {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    },
    [recordedKeys]
  );
  return react_1["default"].createElement(
    react_1["default"].Fragment,
    null,
    react_1["default"].createElement("h1", null, "QMK Macro Recorder"),
    !isRecording
      ? react_1["default"].createElement(
          "button",
          { onClick: startRecording },
          "Record"
        )
      : react_1["default"].createElement(
          "button",
          { onClick: stopRecording },
          "Stop recording"
        ),
    keys
      ? react_1["default"].createElement(
          "code",
          null,
          keys.map(function (x) {
            return "\n".concat(JSON.stringify(x));
          })
        )
      : null
  );
};
exports.App = App;
//# sourceMappingURL=App.js.map
