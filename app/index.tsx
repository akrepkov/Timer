import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ImageSourcePropType, Vibration } from 'react-native';

const { width, height } = Dimensions.get('window');
const cellWidth = width / 2;
const cellHeight = height / 2;

type Egg = {
    id: number;
    name: string;
    time: number;
    image: ImageSourcePropType;
};

const EggTypes = [
    { id: 1, name: 'Soft', comment: 'Firm whites, runny yolk', time: 300, image: require('../assets/images/icon.png') },
    { id: 2, name: 'Medium', comment: 'Fully set whites, creamy center', time: 420, image: require('../assets/images/icon.png') },
    { id: 3, name: 'Hard', comment: 'Fully set whites and yolk', time: 540, image: require('../assets/images/icon.png') },
    { id: 4, name: 'Extra Hard', comment: 'Good for grating or slicing', time: 600, image: require('../assets/images/icon.png') },
];

export default function App() {
    const [activeEgg, setActiveEgg] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const timerRef = useRef(0);

    const startTimer = (egg: Egg) => {
        if (activeEgg === egg.id) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            setActiveEgg(0);
            setSecondsLeft(0);
            return;
        }
        setActiveEgg(egg.id);
        setSecondsLeft(egg.time);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    Vibration.vibrate(2000);
                    setTimeout(() => {
                        setActiveEgg(0);
                    }, 2000);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);
    /*
    useEffect runs after rendering (mount or updates).
    When you return a function inside useEffect, React calls that function 
    BEFORE the component unmounts (or before running the effect again).
    This is important to clean up things (like timers) early and prevent memory leaks.
    */
    const formatTime = (sec) => {
        const min = Math.floor(sec / 60).toString().padStart(2, '0');
        const secLeft = (sec % 60).toString().padStart(2, '0');
        return `${min}:${secLeft}`;
    };
    return (
        <View style={styles.container}>
            {EggTypes.map((egg) => (
                <TouchableOpacity key={egg.id} style={styles.cell} onPress={() => startTimer(egg)}>
                    {activeEgg === egg.id ? (
                        secondsLeft > 0 ? (
                            <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
                        ) : (
                            <Text style={styles.doneText}>Done!</Text>
                        )
                    ) : (
                        <>
                            <Image source={egg.image} style={styles.image} />
                            <Text style={styles.cellText}>{egg.name}</Text>
                            <Text style={styles.commentText}>{egg.comment}</Text>
                        </>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#a1a179',
    },
    cell: {
        width: cellWidth,
        height: cellHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a1a179',
        borderColor: '#e6e6e6',
        borderWidth: 1,
    },
    cellText: {
        fontSize: 28,
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 5,
    },
    commentText: {
        padding: 2,
        fontSize: 20,
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
    },
    image: {
        width: '60%',
        height: '60%',
        resizeMode: 'contain',
        marginBottom: 10,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    doneText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
    },

});


/*
{[1, 2, 3, 4].map((egg) => (

))}
[]: We're creating an array with four eggbers: 1, 2, 3, and 4.
.map(...): This function transforms each item in the array into a React element.
(egg) => (...): This is an arrow function that takes each eggber (egg) and returns JSX.
*/

/*
$ npx create-expo-app@latest
npm run web
*/