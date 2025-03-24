import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native'
import { useState, useEffect } from 'react'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FormLabel } from '@/components/FormLabel'
import { useUser } from '@/contexts/UserContext'
import { router } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [validPassword, setValidPassword] = useState(false)
    const [validEmail, setValidEmail] = useState(false)

    const user = useUser()

    useEffect(() => {
        // check password length
        if (password.length >= 8) {
            setValidPassword(true)
        }
        else {
            setValidPassword(false)
        }
    }, [password])

    useEffect(() => {
        if (email.includes('@') && email.indexOf('@') > 0) {
            setValidEmail(true)
        }
        else {
            setValidEmail(false)
        }
    }, [email])

    const signUp = async () => {
       const signup = await user.login( email, password )
       router.navigate('../(tabs)/')
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Cranberry</Text>
                <Text style={styles.title}>Dog Care</Text>
                <br></br><br></br><br></br><br></br>
                <View style={styles.inputContainer}>
                    <AntDesign name="user" size={24} color="#FFE390" />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={(val) => setEmail(val)}
                        placeholder="Enter your email"
                        placeholderTextColor="#D2D2D5"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <AntDesign name="lock" size={24} color="#FFE390" />
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(val) => setPassword(val)}
                        placeholder="Enter password"
                    />
                </View>
                <Pressable
                    style={(validPassword && validEmail) ? styles.button : styles.buttonDisabled}
                    disabled={(validPassword && validEmail) ? false : true}
                    onPress={() => signUp()}
                >
                    <Text style={styles.buttonText}>SIGN IN</Text>
                </Pressable>
                <Link href="/signup">
                    <Text>Create an account</Text>
                </Link>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2B2943",
        justifyContent: 'center'
    },
    form: {
        marginTop: 50,
        marginHorizontal: 40,
    },
    title: {
        fontSize: 32,
        textAlign: "center",
        fontFamily: "Inknut Antiqua",
        color: "white",
        fontWeight: "bold"
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#1E1D2F",
        borderRadius: 12,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        marginBottom: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        fontSize: 14,
        color: "#D2D2D5",
        flex: 1, 
        padding : 5,
    },
    button: {
        marginVertical: 15,
        padding: 10,
        backgroundColor: "#FFE390",
        borderRadius: 12,
    },
    buttonText: {
        textAlign: "center",
        color: "black",
        fontWeight : "bold",
    },
    buttonDisabled: {
        backgroundColor: "#EDD694",
        marginVertical: 15,
        padding: 10,
        borderRadius: 12,
    }
})
