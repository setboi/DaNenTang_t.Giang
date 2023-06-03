import { Button,StyleSheet,SafeAreaView,ScrollView,View,Text,Image } from 'react-native';
import React from 'react';
import { useState,useEffect } from 'react';
import Student from '../components/Student';

const HomeScreen = ({ navigation }) => {
    const [students, setStudents] = useState([]);
    const [authInfo, setAuthInfo] = useState();
    
    const navigateToLogin = () => {
        navigation.navigate('Login');
    };
     // Funtion lấy data login từ AsyncStorage
    const retrieveData = async () => {
        try {
            const authInfo = await AsyncStorage.getItem('authInfo');
            if (authInfo !== null) {
                log.info('====> authInfo from AsyncStorage', authInfo);
                setAuthInfo(JSON.parse(authInfo));
            }
        } catch (error) {
            log.error(error);
        }
    };
     // Funtion logout
     const doLogout = () => {
        AsyncStorage.removeItem('authInfo');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        });
    };
 async function getListStudent() {
        try {
            const API_URL = 'http://10.24.24.5:3000/students';
            const response = await fetch(API_URL);
            const data = await response.json();
            setStudents(data);
            return data;
        } catch (error) {
            log.error('Fetch data failed ' + error);
            return null;
        }
    }
// Hooks là những hàm cho phép bạn “kết nối” React state và lifecycle vào các components sử dụng hàm.
    // useState() là 1 react hook
    // 6 trường hợp sử dụng của useEffect() trong React
    // 1.Chạy một lần khi mount : tìm nạp data API.
    // 2.Chạy khi thay đổi state : thường thì khi validate input đầu vào.
    // 3.Chạy khi thay đổi state : filtering trực tiếp.
    // 4.Chạy khi thay đổi state : trigger animation trên giá trị của array mới.
    // 5.Chạy khi props thay đổi : update lại list đã fetched API khi data update


    useEffect(() => {
        retrieveData();
        getListStudent();
    }, []);

     // Funtion render danh sách sinh viên
     const renderStudents = () => {
        return (
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View>
                    <Text style={styles.txtHeader}>List Student</Text>
                </View>
                <View style={styles.studentContainer}>
                    {students.map((item, index) => {
                        return <Student student={item} key={index}></Student>;
                    })}
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {authInfo ? <Button title='Logout' onPress={doLogout} /> : <Button title='Go to Login Screen' onPress={navigateToLogin} />}
            {authInfo?.role === 'ADMIN' ? renderStudents() : null}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        flexGrow: 1,
        padding: 20
    },
    txtHeader: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    studentContainer: {
        flex: 1
    }
});

export default HomeScreen;