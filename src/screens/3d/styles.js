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
    indicator: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: '4%', 
        alignItems: 'center',
        height: height * 0.1,
        width: width * 0.8 
    },
    indicator_text: {
        fontSize: 12, 
        fontWeight: '800'
    },
});

export default styles;
