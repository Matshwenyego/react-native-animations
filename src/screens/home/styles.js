import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#A5F1FA'
    },
    inner_container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    text: {
        fontSize: 42,
        letterSpacing: 3,
        fontWeight: '900',
        marginRight: 8,
        textAlign: 'center'
    },
});

export default styles;
