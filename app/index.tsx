import { I18nManager } from "react-native";
import { PaperProvider } from "react-native-paper";
import RootLayout from "./_layout";
import theme from "./theme/theme";

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}


export default function Index() {
  return (
    <PaperProvider theme={theme}>
      <RootLayout />
    </PaperProvider>
  );
}


