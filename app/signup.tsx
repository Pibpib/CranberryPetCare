import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Spacer } from '@/components/Spacer';

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [validPassword, setValidPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false); // New state for password match

  const user = useUser();

  // Check password validity
  useEffect(() => {
    if (password.length >= 8) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  }, [password]);

  // Check email validity
  useEffect(() => {
    if (email.includes('@') && email.indexOf('@') > 0) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  }, [email]);

  // Check if passwords match
  useEffect(() => {
    if (password === confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  const signUp = async () => {
    const signup = await user.register(email, password);
    router.navigate('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <Spacer height={30} />
        
        {/* Email Input */}
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

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <AntDesign name="lock" size={24} color="#FFE390" />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={password}
            onChangeText={(val) => setPassword(val)}
            placeholder="Enter password"
            placeholderTextColor="#D2D2D5"
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <AntDesign name="lock" size={24} color="#FFE390" />
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(val) => setConfirmPassword(val)}
            placeholder="Confirm password"
            placeholderTextColor="#D2D2D5"
          />
        </View>

        <Pressable
          style={validPassword && validEmail && passwordsMatch ? styles.button : styles.buttonDisabled}
          disabled={validPassword && validEmail && passwordsMatch ? false : true}
          onPress={() => signUp()}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </Pressable>

        <Link href="/">
          <Text>Login to your account</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2B2943",
    justifyContent: 'center',
  },
  form: {
    marginTop: 50,
    marginHorizontal: 40,
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Inknut Antiqua",
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
  input: {
    fontSize: 14,
    color: "#D2D2D5",
    flex: 1,
    padding: 5,
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
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#EDD694",
    marginVertical: 15,
    padding: 10,
    borderRadius: 12,
  }
});
