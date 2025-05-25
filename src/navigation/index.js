import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home';
import ThreeD from '../screens/3d';
import Wave from '../screens/wave';

const RootNavigator = () => {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator screenOptions={{ header: () => null }}>
            <Screen name="Home" component={Home} />
            <Screen name="3D" component={ThreeD} />
            <Screen name="Wave" component={Wave} />
        </Navigator>
    )
}
export default RootNavigator;
