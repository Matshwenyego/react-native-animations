import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const Home =  ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>SELECT ANIMATION TO PREVIEW</Text>
            <View style={styles.inner_container}>
                <TouchableOpacity onPress={() => navigation.navigate('3D')}>
                    <Text style={styles.text}> 
                        3D
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Wave')}>
                    <Text style={styles.text}>
                        Wave
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Home;