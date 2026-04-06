/**
 * Custom Expo config plugin for react-native-maps with Google Maps support.
 *
 * The built-in react-native-maps config plugin uses /@UIApplicationMain/ as
 * the anchor for injecting Google Maps imports into AppDelegate.swift.
 * Expo SDK 55 generates AppDelegate with @main instead of @UIApplicationMain,
 * causing the plugin to fail with "AppDelegate is malformed".
 *
 * This plugin replaces the broken AppDelegate handling with correct anchors
 * while reusing the working Podfile and Info.plist modifications.
 */
const {
  withInfoPlist,
  withAppDelegate,
  withPodfile,
  withAndroidManifest,
} = require("@expo/config-plugins");
const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode");
const {
  addMetaDataItemToMainApplication,
  getMainApplicationOrThrow,
} = require("@expo/config-plugins/build/android/Manifest");

function addMapsCocoaPods(src) {
  const newSrc = [
    '  rn_maps_path = File.dirname(`node --print "require.resolve(\'react-native-maps/package.json\')"`) ',
    "  pod 'react-native-maps/Google', :path => rn_maps_path ",
  ].join("\n");

  return mergeContents({
    tag: "react-native-maps",
    src,
    newSrc,
    anchor: /use_native_modules/,
    offset: 0,
    comment: "#",
  });
}

function addGoogleMapsImport(src) {
  const newSrc = [
    "#if canImport(GoogleMaps)",
    "import GoogleMaps",
    "#endif",
  ].join("\n");

  return mergeContents({
    tag: "react-native-maps-import",
    src,
    newSrc,
    // Use @main (Expo SDK 55) instead of @UIApplicationMain
    anchor: /@main/,
    offset: 0,
    comment: "//",
  });
}

function addGoogleMapsInit(src, apiKey) {
  const newSrc = [
    "#if canImport(GoogleMaps)",
    `GMSServices.provideAPIKey("${apiKey}")`,
    "#endif",
  ].join("\n");

  return mergeContents({
    tag: "react-native-maps-init",
    src,
    newSrc,
    anchor:
      /\bsuper\.application\(\w+?, didFinishLaunchingWithOptions: \w+?\)/g,
    offset: 0,
    comment: "//",
  });
}

function withGoogleMaps(config, { apiKey }) {
  if (!apiKey) {
    throw new Error("withGoogleMaps: apiKey is required");
  }

  // 1. Set Google Maps API key in AndroidManifest.xml
  config = withAndroidManifest(config, (conf) => {
    const mainApplication = getMainApplicationOrThrow(conf.modResults);
    addMetaDataItemToMainApplication(
      mainApplication,
      "com.google.android.geo.API_KEY",
      apiKey
    );
    return conf;
  });

  // 2. Set GMSApiKey in Info.plist
  config = withInfoPlist(config, (conf) => {
    conf.modResults.GMSApiKey = apiKey;
    return conf;
  });

  // 3. Add react-native-maps/Google subspec to Podfile
  config = withPodfile(config, (conf) => {
    const result = addMapsCocoaPods(conf.modResults.contents);
    if (result.didMerge || result.didClear) {
      conf.modResults.contents = result.contents;
    }
    return conf;
  });

  // 4. Add Google Maps import and init to AppDelegate
  config = withAppDelegate(config, (conf) => {
    if (conf.modResults.language !== "swift") {
      throw new Error(
        `withGoogleMaps: AppDelegate language "${conf.modResults.language}" is not supported`
      );
    }

    conf.modResults.contents = addGoogleMapsImport(
      conf.modResults.contents
    ).contents;
    conf.modResults.contents = addGoogleMapsInit(
      conf.modResults.contents,
      apiKey
    ).contents;

    return conf;
  });

  return config;
}

module.exports = withGoogleMaps;
