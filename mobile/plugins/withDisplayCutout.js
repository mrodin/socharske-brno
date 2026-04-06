/**
 * Extend app content into the display cutout (notch/punch-hole) area on Android.
 * Sets android:windowLayoutInDisplayCutoutMode="shortEdges" so the app renders
 * edge-to-edge, similar to how iOS handles the notch.
 */
const { withAndroidStyles } = require("@expo/config-plugins");

function withDisplayCutout(config) {
  return withAndroidStyles(config, (conf) => {
    const styles = conf.modResults;

    // Find the AppTheme style
    const appTheme = styles.resources.style.find(
      (s) => s.$.name === "AppTheme"
    );

    if (appTheme) {
      // Remove existing cutout mode item if present
      appTheme.item = (appTheme.item || []).filter(
        (item) => item.$.name !== "android:windowLayoutInDisplayCutoutMode"
      );

      // Add shortEdges mode — content extends into cutout area
      appTheme.item.push({
        $: { name: "android:windowLayoutInDisplayCutoutMode" },
        _: "shortEdges",
      });
    }

    return conf;
  });
}

module.exports = withDisplayCutout;
