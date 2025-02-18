import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Link } from 'expo-router';
import { colors } from '../constants/Styles';

interface AuthFormProps {
    isSignUp: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignUp }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { signIn, signUp } = useAuth();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (isSignUp) {
                await signUp(email, password);
            } else {
                await signIn(email, password);
            }
        } catch (error: any) {  //  Use 'any' or a more specific error type if you know it
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="small" color="#0000ff" />
            ) : (
                <Button title={isSignUp ? 'Sign Up' : 'Sign In'} onPress={handleSubmit} disabled={loading} />
            )}

             <View style={styles.footer}>
                <Text>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </Text>
                {/* Wrap the Link component around the TouchableOpacity or Text */}
                <Link href={isSignUp ? '/(auth)/sign-in' : '/(auth)/sign-up'} asChild>
                    <Text style={{ color: colors.primary }}> {isSignUp ? 'Sign In' : 'Sign Up'}</Text>
                </Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    footer:{
      alignItems: 'center',
      marginTop: 10,
    },
});

export default AuthForm;