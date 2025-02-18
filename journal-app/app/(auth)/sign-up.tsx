import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { globalStyles, colors, authStyles } from '../../constants/Styles';

export default function SignUpScreen() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password);
            Alert.alert(
                'Success', 
                'Account created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(auth)/sign-in')
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[globalStyles.container, authStyles.container]}>
            <Text style={authStyles.title}>Create Account</Text>
            
            <TextInput
                style={authStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            
            <TextInput
                style={authStyles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={authStyles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            
            <Button
                title={loading ? "Creating account..." : "Sign Up"}
                onPress={handleSignUp}
                disabled={loading}
            />

            <View style={authStyles.footer}>
                <Text>Already have an account? </Text>
                <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity>
                        <Text style={authStyles.link}>Sign In</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}