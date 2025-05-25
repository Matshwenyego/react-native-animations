import { Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import styles from './styles';


const Back =  ({ }) => {
    const navigation = useNavigation();
    return (
        <MotiView 
            from={{ opacity: 0.1, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
                type: 'timing',
                duration: 1000,
                // easing: Easing.out((Easing.ease)),
                easing: Easing.elastic(1),
                delay: 50,
            }}
        >
            <TouchableOpacity style={styles.container} onPress={() => navigation.goBack()}>
                <AntDesign name='swapleft' size={42} color='black' />
                <Text style={styles.indicator_text}>BACK</Text>
            </TouchableOpacity>
        </MotiView>
    );
};

export default Back;