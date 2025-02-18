import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { globalStyles, colors, settingsStyles } from '../../constants/Styles';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleSignIn = () => {
        router.push('/(auth)/sign-in');
    };

    return (
        <View style={globalStyles.container}>
            <View style={settingsStyles.section}>
                {user ? (
                    <>
                        <Text style={settingsStyles.email}>Signed in as: {user.email}</Text>
                        <Button 
                            title="Sign Out" 
                            onPress={handleSignOut}
                            color={colors.primary}
                        />
                    </>
                ) : (
                    <>
                        <Text style={settingsStyles.email}>Not signed in</Text>
                        <Button 
                            title="Sign In" 
                            onPress={handleSignIn}
                            color={colors.primary}
                        />
                    </>
                )}
            </View>
        </View>
    );
}