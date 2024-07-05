import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default function App(){
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Calendar</Text>
            </View>
            <View style={styles.calendarContainer}>
            <Calendar
                current={'2023-05-16'}
                minDate={'2022-05-10'}
                maxDate={'2024-05-30'}
                onDayPress={(day) => {
                    console.log('selected day', day);
                }}
                monthFormat={'yyyy MM'}
                onMonthChange={(month) => {
                    console.log('month changed', month);
                }}
                hideArrows={false}
                renderArrow={(direction) => (direction === 'left' ? <Text>{'<'}</Text> : <Text>{'>'}</Text>)}
                hideExtraDays={true}
                disableMonthChange={true}
                firstDay={1}
                showWeekNumbers={true}
                onPressArrowLeft={(subtractMonth) => subtractMonth()}
                onPressArrowRight={(addMonth) => addMonth()}
                disableArrowLeft={false}
                disableArrowRight={false}
                disableAllTouchEventsForDisabledDays={true}
                enableSwipeMonths={true}
            />


            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header :{
        padding: 16,
        backgroundColor: "#6200EE",
    },
    title:{
        fontSize: 24,
        color: '#ffffff',
        textAlign: 'center',
    },
    calendarContainer:{
        flex: 1,
        padding: 16,
    },
});
