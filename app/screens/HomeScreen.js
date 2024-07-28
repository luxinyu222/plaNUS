import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, Dimensions, ScrollView, SafeAreaView, Platform, Alert } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { parse } from 'query-string'
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

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

  const getSemNo = (url) => {
    const semString = url.split('timetable/')[1].split('/')[0]
    if (semString.substring(0,3)==='sem'){
        return parseInt(semString.charAt(4));
    }
    else{
        Alert.alert('We currently only support importing from semester 1 and 2');
        return -1;
    }
  }

  
const HomeScreen = () => {
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
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [nusmodsModalVisible, setNusmodsModalVisible] = useState(false);
    const [nusmodsUrl, setNusmodsUrl] = useState('');
    const [taskCategory, setTaskCategory] = useState('');
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTaskKey, setEditingTaskKey] = useState(null);

    const termInfo = {
        1:{
            1: {start:"2024-8-12", end:"2024-8-16"},
            2: {start:"2024-8-19", end:"2024-8-23"},
            3: {start:"2024-8-26", end:"2024-8-30"},
            4: {start:"2024-9-2", end:"2024-9-6"},
            5: {start:"2024-9-9", end:"2024-9-13"},
            6: {start:"2024-9-16", end:"2024-9-20"},
            7: {start:"2024-9-30", end:"2024-10-5"},
            8: {start:"2024-10-7", end:"2024-10-11"},
            9: {start:"2024-10-14", end:"2024-10-18"},
            10: {start:"2024-10-21", end:"2024-10-25"},
            11: {start:"2024-10-28", end:"2024-11-1"},
            12: {start:"2024-11-4", end:"2024-11-8"},
            13: {start:"2024-11-11", end:"2024-11-15"},
        },
        2:{
            1: {start:"2025-1-13", end:"2025-1-17"},
            2: {start:"2025-1-20", end:"2025-1-24"},
            3: {start:"2025-1-27", end:"2025-1-31"},
            4: {start:"2025-2-3", end:"2025-2-7"},
            5: {start:"2025-2-10", end:"2025-2-14"},
            6: {start:"2025-2-17", end:"2025-2-21"},
            7: {start:"2025-3-3", end:"2025-3-7"},
            8: {start:"2025-3-10", end:"2025-3-14"},
            9: {start:"2025-3-17", end:"2025-3-21"},
            10: {start:"2025-3-24", end:"2025-3-28"},
            11: {start:"2025-3-31", end:"2025-4-4"},
            12: {start:"2025-4-7", end:"2025-4-11"},
            13: {start:"2025-4-14", end:"2025-4-18"},
        }
    }

    const abbr = {
        "Lecture": "LEC",
        "Tutorial": "TUT",
        "Laboratory": "LAB",
        "Recitation": "REC",
        "Sectional Teaching": "SEC",
    }

    const catColorsDark = {
        "lesson": "blue",
        "study": "red",
        "excercise": "orange",
        "":"green",
        "null":"green",
    }

    const catColorsLight = {
        "lesson": "#cde4ff",
        "study": "#fcb9e4",
        "excercise": "#ffe57f",
        "":"#dcf99f",
        "null":"#dcf99f",
    }

    const taskCategories = [
        { label: 'Lesson', value: 'lesson', color: catColorsDark.lesson },
        { label: 'Study', value: 'study', color: catColorsDark.study },
        { label: 'Excercise', value: 'excercise', color: catColorsDark.excercise },
    ]

    const generateUniqueKey = (date)=>{
        return `${date}-${Math.random().toString(36).substring(2, 9)}`;
    }

    const handleTaskPress = (task) => {
        setSelectedTask(task);
        setTaskModalVisible(true);
        console.log(task);
    };

    const handleAddTask = () => {
        if (!newTask) {Alert.alert('Please enter a Name for your task!'); return;};
        if (newTask && selectedDate) {
            setTasks((prevTasks) => {
                const updatedTasks = { ...prevTasks };
    
                if (editingTaskKey) {
                    // Update existing task
                    const oldDate = Object.keys(updatedTasks).find(date =>
                        updatedTasks[date].some(task => task.key === editingTaskKey)
                    );
    
                    if (oldDate) {
                        // Find the task in the old date and update it
                        const taskToUpdate = updatedTasks[oldDate].find(task => task.key === editingTaskKey);
    
                        // Remove the task from the old date
                        updatedTasks[oldDate] = updatedTasks[oldDate].filter(task => task.key !== editingTaskKey);
    
                        if (updatedTasks[oldDate].length === 0) {
                            delete updatedTasks[oldDate];
                        }
    
                        // Update task details
                        taskToUpdate.name = newTask;
                        taskToUpdate.category = taskCategory;
                        taskToUpdate.date = selectedDate;
                        taskToUpdate.semLabel = taskToUpdate.semLabel;
                        taskToUpdate.weeks = taskToUpdate.weeks;
    
                        // Add the task to the new date
                        if (!updatedTasks[selectedDate]) {
                            updatedTasks[selectedDate] = [];
                        }
                        updatedTasks[selectedDate].push(taskToUpdate);
                    }
                } else {
                    // Add new task
                    if (!updatedTasks[selectedDate]) {
                        updatedTasks[selectedDate] = [];
                    }
                    updatedTasks[selectedDate].push({
                        key: generateUniqueKey(selectedDate),
                        name: newTask,
                        category: taskCategory, 
                        date: selectedDate, 
                        semLabel: '',
                        weeks: [],
                    });
                }
    
                return updatedTasks;
            });
    


            
            setNewTask('');
            setSelectedDate(todayDate);
            setModalVisible(false);
            setTaskCategory('');
            setEditingTaskKey(null)
        }
    };

    const handleCancel = () =>{
        setModalVisible(false);
        setNewTask('');
        setSelectedDate(todayDate);
        setTaskCategory('');
        setEditingTaskKey(null);
    }

    const handleDeleteTask = () => {
        if (selectedTask) {
            setTasks((prevTasks) => {
                const updatedTasks = { ...prevTasks };
                const taskDate = Object.keys(updatedTasks).find(date => 
                    updatedTasks[date].some(task => task.key === selectedTask.key)
                );
    
                if (taskDate) {
                    updatedTasks[taskDate] = updatedTasks[taskDate].filter(task => task.key !== selectedTask.key);
                    if (updatedTasks[taskDate].length === 0) {
                        delete updatedTasks[taskDate];
                    }
                }
    
                return updatedTasks;
            });
            setTaskModalVisible(false);
            setSelectedTask(null);
        }
    };

    const handleEditTask = () => {
        if (selectedTask) {
            setNewTask(selectedTask.name);
            setTaskCategory(selectedTask.category);
            setSelectedDate(selectedTask.date);
            setEditingTaskKey(selectedTask.key);
            setTaskModalVisible(false);
            setModalVisible(true); // Open the add task modal
        }
    };

    const handleSaveNote = () => {
        setTasks((prevTasks) => {
            const updatedTasks = { ...prevTasks };
    
            const taskDate = Object.keys(updatedTasks).find(date =>
                updatedTasks[date].some(task => task.key === selectedTask.key)
            );
    
            if (taskDate) {
                updatedTasks[taskDate] = updatedTasks[taskDate].map(task =>
                    task.key === selectedTask.key ? { ...task, note: selectedTask.note } : task
                );
            }
    
            return updatedTasks;
        });
    };
    
    const renderAddButton = () => {
        if (editingTaskKey) {
            return "Edit";
        }
        else {
            return "Add";
        }
    }

    const renderDayContent = (date) => {
        
        return (
            <View>
                {tasks[date]?.map((task, index) => (
                    <TouchableOpacity 
                        key={task.key}
                        onPress={()=> handleTaskPress(task)}>
                    <Text key={index} style={{
                        backgroundColor: catColorsLight[task.category],
                        textAlign:"center",
                        marginVertical:1,
                        fontSize:11,
                    }}>{task.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const markedDates = {
        [todayDate]:{selected: true, marked: true, selectedColor:'blue'},
    }

    const getWeekNumber = (date, sem) => {
        for (let week = 1; week <= 13; week++) {
            const start = new Date(termInfo[sem][week].start);
            const end = new Date(termInfo[sem][week].end);
            if (date >= start && date <= end) {
                return week;
            }
        }
        return -1; // Not within any specified week
    };

    const getCourseInfo = async (queryParams, sem) => {
        const baseApiUrl = "https://api.nusmods.com/v2";
        const acadYear = "2024-2025";
        let courseInfo = {};
        let hiddenCourses = [];

        for (const key in queryParams) {
            if (key === "hidden") {
                hiddenCourses = queryParams[key].split(',');
            }
        }
        console.log("Hidden Courses:", hiddenCourses);

        for (const course in queryParams) {
            if (hiddenCourses.some(hiddenCourse => hiddenCourse === course) || course === "hidden") {
                continue;
            }

            const classes = queryParams[course].split(',');
            const apiUrl = `${baseApiUrl}/${acadYear}/modules/${course}.json`;
            const response = await axios.get(apiUrl);

            // console.log("classes:", classes);

            if (response.status === 200) {
                const data = response.data;
                courseInfo[course] = {
                    "module": data.moduleCode,
                    "timetable": [],
                };

                data.semesterData.forEach((entry) => {
                    if (entry.semester === sem) {
                        entry.timetable.forEach((timetableEntry) => {
                            const abbrKey = abbr[timetableEntry.lessonType];
                            if (classes.some(cls => cls === `${abbrKey}:${timetableEntry.classNo}`)) {
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
            let parsedUrl = new URL(nusmodsUrl);
            parsedUrl = parsedUrl.href.replace(/\/$/, '');    // Remove trailing slash
            const queryParams = parseQueryString(parsedUrl);
            const sem = getSemNo(parsedUrl)
            const info = await getCourseInfo(queryParams,sem);

            if (sem === -1) {
                handleCloseNusmodsModal();
                return;
            }
            // console.log("quaryParams:", queryParams);
            // console.log(parsedUrl);
    
            // Get all dates in the current semester
            const getAllDatesInSem = (year,sem) => {
                let dates = [];
                const semInfo = termInfo[sem];
                const startDate = new Date(semInfo[1].start);
                const endDate = new Date(semInfo[13].end);
                let date = new Date(startDate);
                while (date <= endDate) {
                    dates.push(new Date(date));
                    date.setDate(date.getDate() + 1);
                }
                return dates;
            };
    
            const currentDate = new Date(todayDate);
            const datesInSem = getAllDatesInSem(currentDate.getFullYear(), sem);
    
            // Add the retrieved course info as tasks
            const newTasks = {};
            datesInSem.forEach(date => {
                const weekNumber = getWeekNumber(date, sem);
                if(weekNumber===-1) return;

                Object.entries(info).forEach(([course, data]) => {
                    data.timetable.forEach(timetable => {
                        if (!timetable.weeks.includes(weekNumber)) {
                            return;
                        }

                        const dayOffset = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday'].indexOf(timetable.day);
                        if (date.getDay() === dayOffset) {
                            const dateString = date.toISOString().split('T')[0];
                            if (!newTasks[dateString]) {
                                newTasks[dateString] = [];
                            }
    
                            newTasks[dateString].push({
                                key: generateUniqueKey(dateString),
                                name: `${data.module}`,
                                date: dateString,
                                category: 'lesson',
                                semLabel: sem,
                                weeks: timetable.weeks,
                            });
                            // console.log(timetable.weeks)
                        }
                    });
                });
            });
            Alert.alert('Schedule imported successfully!');
    
            // console.log("New Tasks:", newTasks)
            setTasks((prevTasks) => {
                const mergedTasks = {...prevTasks};
                Object.entries(mergedTasks).forEach(([date, tasks]) => {
                    mergedTasks[date] = tasks.filter(task => task.semLabel !== sem);
                    if (mergedTasks[date].length === 0) {
                        delete mergedTasks[date];
                    }
                });
                Object.entries(newTasks).forEach(([date, tasks]) => {
                    if(!mergedTasks[date]){
                        mergedTasks[date] = [];
                    }
                    mergedTasks[date] = [...mergedTasks[date], ...tasks];
                });
                console.log("Merged Tasks:", mergedTasks);
                return mergedTasks;
            }); 

            handleCloseNusmodsModal();
        } catch (error) {
            Alert.alert('Failed to fetch data from NUSMods, please check the URL and try again.');
            // console.error(error);
        }
    };
    
    
    
    const handleOpenNusmodsModal = () => {
        setNusmodsModalVisible(true);
        setModalVisible(false);
        setNewTask('');
        setSelectedDate(todayDate);
        // console.log(nusmodsModalVisible)
    };

    const handleCloseNusmodsModal = () => {
        setNusmodsModalVisible(false);
        setNusmodsUrl('');
        setShowDatePicker(false);
    };

    const showMode = () => {
        setShowDatePicker(true);
    };
    const hideMode = () => {
        setShowDatePicker(false);
    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date(selectedDate);
        setShowDatePicker(Platform.OS === 'ios');
        setSelectedDate(currentDate.toISOString().split('T')[0]);
    };

    return (
        <SafeAreaView style={styles.container}>
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
                        
                            <View style={{width:50, height:Dimensions.get('window').height/9, alignItems:"center"}}>
                                <TouchableOpacity onPress={() =>{
                                    // console.log('selected day', dateString);
                                    setSelectedDate(dateString);
                                    setModalVisible(true);
                                }}>
                                    <View style={[styles.circle,{backgroundColor:dateString===todayDate?"#00adf5":"white"}]}>
                                    <Text style={{
                                        textAlign:'center',
                                        color:dateString===todayDate?"white":(state==='disabled' ? 'grey' : 'black'),
                                    }}>
                                        {date.day}
                                    </Text>
                                    </View>
                                </TouchableOpacity>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {renderDayContent(dateString)}
                                </ScrollView>
                            </View>
                        

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
                    <RNPickerSelect
                        placeholder={{label:'Task Category', value:null}}
                        onValueChange={(value) => {setTaskCategory(value)}}
                        items={taskCategories}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 15,
                                right: 10,
                            },
                        }}
                        Icon={() => {
                            return (
                                <View
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderTopWidth: 10,
                                        borderTopColor: catColorsDark[taskCategory],
                                        
                                        borderRightColor: 'transparent',
                                        borderLeftColor: 'transparent',
                                        width:10,
                                        height:10,
                                        borderRadius:5,
                                        // alignItems:"center",
                                        // justifyContent:"center"
                                    }}
                                />
                            );
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Select Date"
                        value={selectedDate}
                        onFocus={showMode}
                        onBlur={hideMode}
                    />
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(selectedDate)}
                            mode={"date"}
                            display="inline"
                            onChange={onChange}
                            style={{width:'100%'}}
                            
                        />
                    )}
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
                            <Text style={styles.buttonText}>{renderAddButton()}</Text>
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={taskModalVisible}
                onRequestClose={()=>{
                    handleSaveNote();
                    setTaskModalVisible(false)
                }}>
                <View style={styles.modalOverlay}>
                <View style={styles.taskModalContainer}>
                    <View style={[styles.modalView,{padding:10}]}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            activeOpacity={0.8}
                            onPress={() => {
                                handleSaveNote();
                                setTaskModalVisible(false)}}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>

                        <View style={{
                            // backgroundColor:"green",
                            flexDirection:'row',
                            width:Dimensions.get('window').width-60,
                            // height:40,
                            // justifyContent:'space-evenly',
                            }}>
                            <View style={[styles.circle,{width:17,height:17,backgroundColor:catColorsLight[selectedTask?.category]}]}></View>
                            <Text style={[styles.modalText,{flex:1,textAlign:'left'}]}>{selectedTask?.name}</Text>
                            <Text style={[styles.modalText,{flex:1,textAlign:'right'}]}>{selectedTask?.date}</Text>
                        </View>
                        
                        <TextInput
                            style={styles.noteInput}
                            multiline={true}
                            numberOfLines={4}
                            placeholder='Add a note...'
                            value={selectedTask?.note || ''}
                            onChangeText={(text) => setSelectedTask({ ...selectedTask, note: text })}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '50%' }}>                       
                            <TouchableOpacity
                                style={styles.button}
                                onPress={()=>{handleEditTask();handleSaveNote();}}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button,styles.deleteButton]}
                                onPress={handleDeleteTask}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>
                </View>
            </Modal>
            
        </SafeAreaView>
        );
        };

const styles = StyleSheet.create({
  modalOverlay:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
  },
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
  closeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 17,
    lineHeight: 17,
    fontWeight: 'bold',
  },

  modalText:{
    marginBottom:15,
    textAlign:'center',
  },
  modalContainer:{
    flex:1,
    justifyContent: 'flex-end',
  },
  taskModalContainer:{
    flex:1,
    justifyContent: 'center',
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom:10,
    width: '100%',
    padding: 10,
  },
  noteInput: {
    height: 80,
    // borderColor: 'gray',
    // borderWidth: 1,
    // borderRadius: 4,
    marginBottom: 10,
    width: '100%',
    padding: 10,
    textAlignVertical: 'top', // Align text at the top in multiline input
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
  deleteButton: {
    backgroundColor:'red',
  },
  circle:{
    width:25,
    height:25,
    borderRadius:12.5,
    alignItems:"center",
    justifyContent:"center"
  },
  pickerSelect: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  }//???
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
    //   fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
      height: 40,
      marginBottom:10,
      width: '100%',
      padding: 10,
    },
    inputAndroid: {
    //   fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });
  

export default HomeScreen;