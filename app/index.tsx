import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ImageSourcePropType, Vibration, StatusBar } from 'react-native';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
// import * as Notifications from 'expo-notifications';
import { AppState } from 'react-native';
// import BackgroundTimer from 'react-native-background-timer';


const { width, height } = Dimensions.get('window');
const cellWidth = width / 2;
const cellHeight = height / 2;
const responsiveFontSize = Math.round(width * 0.05);

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: false,
//     }),
// });



type Egg = {
    id: number;
    name: string;
    time: number;
    image: ImageSourcePropType;
};

const EggTypes = [
    { id: 1, name: 'Soft', comment: 'Firm whites, runny yolk', time: 5, image: require('../assets/images/egg1.png') },
    { id: 2, name: 'Medium', comment: 'Fully set whites, creamy center', time: 420, image: require('../assets/images/egg2.png') },
    { id: 3, name: 'Hard', comment: 'Fully set whites and yolk', time: 540, image: require('../assets/images/egg3.png') },
    { id: 4, name: '', comment: '', time: 600, image: require('../assets/images/icon.png') },
];

export default function App() {
    const [activeEgg, setActiveEgg] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const timerRef = useRef(0);
    const [customMinutes, setCustomMinutes] = useState(1);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [endTimer, setEndTimer] = useState(0);


    const formatTime = (sec) => {
        const min = Math.floor(sec / 60).toString().padStart(2, '0');
        const secLeft = (sec % 60).toString().padStart(2, '0');
        return `${min}:${secLeft}`;
    };
    //for printinh seconds
    useEffect(() => {
        console.log ("active 1: ", activeEgg)
        if (activeEgg === 0) return; // no timer active
        timerRef.current = setInterval(() => {
            const now = Date.now();
            const secondsRemaining = Math.round((endTimer - now) / 1000);
            if (secondsRemaining <= 0) {
                clearInterval(timerRef.current);
                setSecondsLeft(0);
                setActiveEgg(0);
                setEndTimer(0);
                console.log ("Vibrate 1")
                // Vibration.vibrate(2000);
            } else {
                setSecondsLeft(secondsRemaining);
            }
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [activeEgg, endTimer]);

    useEffect(() => {
        if (activeEgg === 0) return; // no timer active
        console.log ("active egg 2: ", activeEgg)
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App comes to foreground, update secondsLeft immediately
                const now = Date.now();
                const secondsRemaining = Math.round((endTimer - now) / 1000);
                console.log(appState, "appstate", secondsRemaining)
                if (secondsRemaining < 0) {
                    clearInterval(timerRef.current);
                    setSecondsLeft(0);
                    setActiveEgg(0);
                    setEndTimer(0);
                    console.log ("Vibrate 2")
                    // Vibration.vibrate(2000);
                } else {
                    setSecondsLeft(secondsRemaining);
                }
            }
            appState.current = nextAppState;
            setAppStateVisible(nextAppState);
        });
        return () => subscription.remove();
    }, [endTimer]);


    const startTimer = (egg: Egg) => {
        if (activeEgg === egg.id) {
            // Stop current timer
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            setActiveEgg(0);
            setSecondsLeft(0);
            setEndTimer(0);
            return;
        }
        let timeToSet = egg.time;
        if (egg.id === 4) {
            if (!customMinutes || customMinutes <= 0) {
                alert("Please select minutes");
                return;
            }
            timeToSet = customMinutes * 60;
        }
        setActiveEgg(egg.id);
        setSecondsLeft(timeToSet);
        setEndTimer(Date.now() + timeToSet * 1000); // Date.now() + milliseconds
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
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#dcc9b6" barStyle="light-content" />
            {EggTypes.map((egg) => (
                <TouchableOpacity key={egg.id} style={styles.cell} activeOpacity={0.5} onPress={() => startTimer(egg)}>
                    {activeEgg === egg.id ? (
                        secondsLeft > 0 ? (
                            <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
                        ) : (
                            <Text style={styles.doneText}>Done!</Text>
                        )
                    ) : (
                        <>{egg.id === 4 ? (
                            <>
                                <WheelPickerExpo
                                    height={200}
                                    width={120}
                                    backgroundColor="#dcc9b6"
                                    items={Array.from({ length: 60 }, (_, i) => ({
                                        label: `${i + 1} min`,
                                        value: i + 1
                                    }))}
                                    initialSelectedIndex={0}
                                    onChange={({ item }) => setCustomMinutes(item.value)}
                                />
                                <View style={styles.rectangle}>
                                    <Text style={styles.text}>Confirm</Text>
                                </View>
                            </>
                        ) : (
                            <Image source={egg.image} style={styles.image} />
                        )}
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
        backgroundColor: '#dcc9b6',
    },
    cell: {
        width: cellWidth,
        height: cellHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dcc9b6',
        // borderColor: '#9d684b',
        borderWidth: 0.5,
    },
    cellText: {
        fontSize: 26,
        color: '#283618',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 0,
    },
    commentText: {
        marginBottom: 2,
        fontSize: 20,
        color: '#2e3138',
        fontWeight: '600',
        textAlign: 'center',
    },
    image: {
        width: '80%',
        height: '50%',
        resizeMode: 'contain',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2e3138',
    },
    doneText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2e3138',
    },
    rectangle: {
        width: '50%',
        height: '10%',
        backgroundColor: '#dcc9b6',
        borderRadius: 10,
        borderColor: '#2e3138',
        borderWidth: 2,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2e3138',
        flexWrap: 'wrap',
        textAlign: 'center',
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