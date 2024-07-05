import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const parseQueryString = (url) => {
    const queryString = url.split('?')[1];
    if (!queryString) {
      return {};
    }
  
    return queryString.split('&').reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      acc[key] = decodeURIComponent(value || '');
      return acc;
    }, {});
  };

  
const HomeScreen = () => {
    console.log('HomeScreen component loaded');
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const todayDate = getCurrentDate();

    const [tasks, setTasks] = useState({'': [],});
    const [modalVisible, setModalVisible] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [selectedDate, setSelectedDate] = useState(todayDate);
    const [nusmodsModalVisible, setNusmodsModalVisible] = useState(false);
    const [nusmodsUrl, setNusmodsUrl] = useState('');

    const abbr = {
        "Lecture": "LEC",
        "Tutorial": "TUT",
        "Laboratory": "LAB",
        "Recitation": "REC",
    }

    const handleAddTask = () => {
        if (newTask && selectedDate){
            setTasks((prevTasks) => ({
                ...prevTasks,
                [selectedDate]: [...(prevTasks[selectedDate] || []), {name: newTask}],
            }));
            setNewTask('');
            setSelectedDate(todayDate);
            setModalVisible(false);
        }
    };

    const handleCancel = () =>{
        setModalVisible(false);
        setNewTask('');
        setSelectedDate(todayDate);
    }

    const renderDayContent = (date) => {
        return (
            <View>
                {tasks[date]?.map((task, index) => (
                    <Text key={index} style={{
                        backgroundColor: "#dfb",
                        textAlign:"center",
                        marginVertical:1,
                        fontSize:11,
                    }}>{task.name}</Text>
                ))}
            </View>
        );
    };

    const markedDates = {
        [todayDate]:{selected: true, marked: true, selectedColor:'blue'},
    }

    const getCourseInfo = async (queryParams) => {
        const baseApiUrl = "https://api.nusmods.com/v2";
        const acadYear = "2023-2024";
        let courseInfo = {};

        for (const course in queryParams) {
            const classes = queryParams[course].split(',');
            const apiUrl = `${baseApiUrl}/${acadYear}/modules/${course}.json`;
            const response = await axios.get(apiUrl);

            if (response.status === 200) {
                const data = response.data;
                courseInfo[course] = {
                    "module": data.moduleCode,
                    "timetable": [],
                };

                data.semesterData.forEach((entry) => {
                    if (entry.semester === 1) {
                        entry.timetable.forEach((timetableEntry) => {
                            if (classes.some(cls => cls === `${abbr[timetableEntry.lessonType]}:${timetableEntry.classNo}`)) {
                                courseInfo[course].timetable.push(timetableEntry);
                            }
                        });
                    }
                });
            }
        }

        return courseInfo;
    };


    const handleFetchNusmodsData = async () => {
        try {
            const parsedUrl = new URL(nusmodsUrl);
            const queryParams = parseQueryString(parsedUrl.href);
            const info = await getCourseInfo(queryParams);
    
            // Get all dates in the current month
            const getAllDatesInMonth = (year, month) => {
                let dates = [];
                let date = new Date(year, month, 1);
                while (date.getMonth() === month) {
                    dates.push(new Date(date));
                    date.setDate(date.getDate() + 1);
                }
                return dates;
            };
    
            const currentDate = new Date(todayDate);
            const datesInMonth = getAllDatesInMonth(currentDate.getFullYear(), currentDate.getMonth());
    
            // Add the retrieved course info as tasks
            const newTasks = {};
            datesInMonth.forEach(date => {
                Object.entries(info).forEach(([course, data]) => {
                    data.timetable.forEach(timetable => {
                        const dayOffset = ['Saturday','Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',].indexOf(timetable.day);
                        if (date.getDay() === dayOffset) {
                            const dateString = date.toISOString().split('T')[0];
                            if (!newTasks[dateString]) {
                                newTasks[dateString] = [];
                            }
    
                            newTasks[dateString].push({
                                name: `${data.module}`,
                                startTime: timetable.startTime,
                                endTime: timetable.endTime,
                            });
                        }
                    });
                });
            });
    
            setTasks((prevTasks) => ({ ...prevTasks, ...newTasks }));
            setNusmodsModalVisible(false);
            setNusmodsUrl('');
        } catch (error) {
            console.error(error);
        }
    };
    
    
    
    const handleOpenNusmodsModal = () => {
        setNusmodsModalVisible(true);
        setModalVisible(false);
        setNewTask('');
        setSelectedDate(todayDate);
        console.log(nusmodsModalVisible)
    };

    const handleCloseNusmodsModal = () => {
        setNusmodsModalVisible(false);
        setNusmodsUrl('');
    };

    return (
        <View style={styles.container}>
            <CalendarList
                horizontal={true}
                pagingEnabled={true}
                onDayPress={(day) => {
                    console.log('selected day', day);
                    setSelectedDate(day.dateString);
                    setModalVisible(true);
                }}
                monthFormat={'yyyy MM'}
                onMonthChange={(month) => {
                    console.log('month changed', month);
                }}
                hideArrows={false}
                hideExtraDays={false}
                disableMonthChange={true}
                firstDay={0}
                onPressArrowLeft={(subtractMonth) => subtractMonth()}
                onPressArrowRight={(addMonth) => addMonth()}
                disableArrowLeft={false}
                disableArrowRight={false}
                disableAllTouchEventsForDisabledDays={false}
                enableSwipeMonths={true}
                markedDates = {markedDates}

                dayComponent={({date, state}) => {
                    const dateString = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

                    const isSelected = markedDates[dateString]?.selected

                    return (
                        <TouchableOpacity onPress={() =>{
                            console.log('selected day', dateString);
                            setSelectedDate(dateString);
                            setModalVisible(true);
                        }}>
                            <View style={{width:50, height:70}}>
                                <Text style={{
                                    textAlign:'center',
                                    color: state==='disabled' ? 'grey' : 'black',
                                    }}>
                                        {date.day}
                                </Text>
                                <Text>
                                    {renderDayContent(dateString)}
                                </Text>
                            </View>
                        </TouchableOpacity>

                    );
                }}

            />
            <FAB 
                style={styles.fab}
                icon={()=><Icon name="plus" size={24} color="purple"/>}
                onPress={() => setModalVisible(true)}
            />

            <Modal 
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCancel}>
                <View style={styles.modalContainer}>
                <View style={[styles.modalView,{justifyContent:'flex-end'}]}>
                    <Text style={styles.modalText}>Add Task</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder='Task Name'
                        value={newTask}
                        onChangeText={setNewTask}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={selectedDate}
                        onChangeText={setSelectedDate}
                    />
                    
                    <Text>or</Text>
                    <Text 
                        onPress={handleOpenNusmodsModal}
                        style = {{color:'#2196F3', textDecorationLine:"underline", paddingBottom:5}}>
                        Import from NUSMods
                    </Text>

                    <View style={{flexDirection: 'row', justifyContent:'space-between', width:'50%'}}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleAddTask}>
                            <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleCancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                        
                </View>
                </View>
            </Modal>


            <Modal
                animationType="slide"
                transparent={true}
                visible={nusmodsModalVisible}
                onRequestClose={handleCloseNusmodsModal}>
                <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Import from NUSMods</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter NUSMods URL"
                            value={nusmodsUrl}
                            onChangeText={setNusmodsUrl}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '50%' }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleFetchNusmodsData}>
                                <Text style={styles.buttonText}>Fetch</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCloseNusmodsModal}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> 
            </Modal>
        </View>
        );
        };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fab: {
    position: 'absolute',
    margin:16,
    right:0,
    bottom: 0,
  },

  modalView: {
    margin:20,
    backgroundColor: 'white',
    borderRadius:20,
    padding:35,
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity:0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText:{
    marginBottom:15,
    textAlign:'center',
  },
  modalContainer:{
    flex:1,
    justifyContent: 'flex-end',
    
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom:10,
    width: '100%',
    padding: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius:20,
    padding:10,
    elevation:2,
    alignItems: "center"
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor:'grey',
  },
  dayContent: {
    
  }
});

export default HomeScreen;