import { useEffect, useState, useRef } from 'react';
import { Animated, Text, View, Dimensions, TouchableOpacity, ActivityIndicator, Platform, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { faker } from '@faker-js/faker';
import Back from '../../components/back';
import styles from './styles';


const ThreeD =  ({ }) => {
    const { width, height } = Dimensions.get('screen');
    const ref = useRef();
    const scrollX = useRef(new Animated.Value(0)).current;
    
    const progress = Animated.modulo(Animated.divide(scrollX, width * 0.8), width * 0.8);

    const [data, setData] = useState([]);
    const [index, setIndex] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const fetch_data = () => {
        faker.seed(10);
        const randomize = [...Array(10).keys()].map((_, i) => {
            return {
                key: faker.string.uuid(),
                image: faker.image.url(),
                title: faker.commerce.productName(),
                subtitle: faker.company.buzzPhrase(),
                price: faker.finance.amount(80, 200, 0),
            };
        });
        if (randomize) {
            setData(randomize);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetch_data();
    }, [])

    return (
        <View style={styles.container}>
            <Back />
            <View style={styles.inner_container}>
            <Animated.View 
                style={{ 
                    height: height * 0.5, 
                    width: width * 0.8, 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: 4,
                }}
            >
                <Animated.FlatList
                    ref={ref}
                    data={data}
                    bounces={false}
                    keyExtractor={(item) => item.key}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => setIndex(Math.floor(event.nativeEvent.contentOffset.x / width * 0.8))}
                    onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], { useNativeDriver: true })}
                    renderItem={({item, index}) => {
                        const inputRange = [(index - 1) * (width * 0.8), index * (width * 0.8), (index + 1) * (width * 0.8)];
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0, 1, 0],
                        });
                        const translateY = scrollX.interpolate({
                            inputRange,
                            outputRange: [50, 0, 20],
                        })
                        return (
                            <Animated.View 
                                style={{ 
                                    width: width * 0.8,
                                    alignItems: 'center', 
                                    opacity,
                                    transform: [{ translateY }]
                                }}
                            >
                                {isLoading ? (
                                    <View style={{ height: height * 0.35, width: width * 0.7, justifyContent: 'center' }}>
                                        <ActivityIndicator size={'large'} color={'#A5F1FA'} />
                                    </View>
                                ) : (
                                <Image 
                                        style={{ 
                                            shadowColor: "#000000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 4,
                                            },
                                            shadowOpacity: 0.5,
                                            shadowRadius: 3.84,
                                            ...Platform.OS === 'android' && {elevation: 5}
                                        }} 
                                        source={{ uri: item.image }} 
                                        height={height * 0.35} 
                                        width={width * 0.7} 
                                        resizeMode='contain' 
                                    />
                                )}
 
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontWeight: '800',
                                        fontSize: 16,
                                        textTransform: 'uppercase',
                                    }}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                >{item.title}</Text>
                                <Text style={{ fontSize: 12, opacity: 0.4 }}>{item.subtitle}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text
                                        style={{
                                            fontSize: 42,
                                            letterSpacing: 3,
                                            fontWeight: '900',
                                            marginRight: 8,
                                        }}
                                    >
                                        {item.price}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            lineHeight: 36,
                                            fontWeight: '800',
                                            alignSelf: 'flex-end',
                                        }}
                                    >
                                        USD
                                    </Text>
                                </View>
                            </Animated.View>
                        )
                    }}
                />

            </Animated.View>
            <Animated.View 
                style={[styles.indicator, 
                    {
                        transform: [
                            { perspective: width * 7 },
                            {
                                rotateY: progress.interpolate({
                                    inputRange: [0, 0.25, 0.75, 1],
                                    outputRange: ["0deg", "90deg", "90deg" ,"0deg"]
                                })
                            }
                        ]
                    }]}
                >
                <TouchableOpacity onPress={() => {
                    ref?.current?.scrollToOffset({
                        offset: (index - 1) * width * 0.8,
                        animated: true
                    });
                }}>
                    <Text style={styles.indicator_text}>PREV</Text>
                    <AntDesign name='swapleft' size={42} color='black' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    ref?.current?.scrollToOffset({
                        offset: (index + 1) * width * 0.8,
                        animated: true
                    });
                }}>
                    <Text style={styles.indicator_text}>NEXT</Text>
                    <AntDesign name='swapright' size={42} color='black' />
                </TouchableOpacity>
            </Animated.View>
            </View>
        </View>
    );
};

export default ThreeD;