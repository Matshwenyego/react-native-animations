import { View} from 'react-native';
import { MotiView } from 'moti'
import { Feather } from '@expo/vector-icons';
import { Easing } from 'react-native-reanimated';
import Back from '../../components/back';
import styles from './styles';


const Wave =  ({ }) => {
    return (
        <View style={styles.container}>
            <Back />
            <View style={styles.inner_container}>
                {['','',''].map((_, index) => {
                    return (
                        <MotiView 
                            key={index}
                            from={{ opacity: 0.7, scale: 1 }}
                            animate={{ opacity: 0, scale: 4 }}
                            transition={{ 
                                type: 'timing',
                                duration: 2000,
                                easing: Easing.out(Easing.ease),
                                delay: index * 400,
                                repeatReverse: false,
                                loop: true
                             }}
                            style={{ 
                                position: 'absolute',
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                width: 100, 
                                height: 100, 
                                borderRadius: 50, 
                                backgroundColor: '#6E01EF' 
                            }}
                        />
                    )
                })}
                <View 
                    style={{ 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: 100, 
                        height: 100, 
                        borderRadius: 50, 
                        backgroundColor: '#6E01EF' 
                    }}>
                    <Feather name="phone-outgoing" size={34} color="#FFFFFF" />
                </View>
            </View>
        </View>
    );
};

export default Wave;