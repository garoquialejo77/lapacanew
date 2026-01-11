import { StyleSheet } from 'react-native';

import NewProductScreen from '../newproduct';

export default function TabTnreeScreen() {
  return (
    <NewProductScreen></NewProductScreen>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
