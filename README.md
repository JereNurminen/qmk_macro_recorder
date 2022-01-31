# QMK Macro Recorder
An online tool for recording QMK macros. Just press record, type your macro and you will receive a QMK macro in the JSON format outlines [here](https://docs.qmk.fm/#/feature_macros?id=using-macros-in-json-keymaps). Well someday maybe - for now this is pretty limited.
## Known limitations
* "tap" actions not registered as taps if another key is held, instead they will be registered as a "down" event followed by a "up" event
* No support for delays between actions, but there are easy to add manually
* Bunch of keys not supported yet, just need to add them to the mappings
* Assumes you're using the ISO-UK layout (just because that's what I'm using)
* All modifiers (Shift, Alt, Control, etc) will be registered as the left side version of said key
<img width="1004" alt="image" src="https://user-images.githubusercontent.com/17700429/151856651-94b0fc44-8f7e-41b9-b57b-5b6c769553be.png">
