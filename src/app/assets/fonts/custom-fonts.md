# Instructions for adding new fonts:

* Find a font in `TTF` or `OTF` format that you like and put it in `./assets/fonts/`.
* Now run `npx react-native link`.
* note ios and android refs font family differently. see below as example

```
const CUSTOM_FONT_TEXT: TextStyle = {
  fontFamily: Platform.select({
    ios: "ScalaMed", // The font family name
    android: "scalamed-font", // The file name
  })....
}
```
