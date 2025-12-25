

import { PaperProvider } from 'react-native-paper';
import MainScreen from './screens/MainScreen';
import theme from './theme/theme';

export default function Index() {
  return (
    <PaperProvider theme={theme}>
      <MainScreen />
    </PaperProvider>
  );
}