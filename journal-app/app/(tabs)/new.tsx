import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { analyzeMood } from '../../lib/gemini';
import { useRouter } from 'expo-router';
import { globalStyles } from '../../constants/Styles';

const NewEntryScreen: React.FC = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();


    const handleSave = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to create an entry.');
            return;
        }

        if (!content.trim()) {
            Alert.alert('Error', 'Please enter some content for your journal entry.');
            return;
        }

        setLoading(true);
        try {
            const { primaryMood, moodScores } = await analyzeMood(content);

            const { error } = await supabase
                .from('entries')
                .insert([
                    { user_id: user.id, content, mood: primaryMood, mood_score: moodScores },
                ]);

            if (error) {
                throw error;
            }
            router.back()

        } catch (error: any) {
            console.error("Error saving entry:", error);
            Alert.alert('Error', error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={globalStyles.container}>
            <TextInput
                style={styles.input}
                multiline
                placeholder="Write your journal entry here..."
                value={content}
                onChangeText={setContent}
            />
            {loading ? (
                <ActivityIndicator size="small" color="#0000ff" />
            ) : (
                <Button title="Save Entry" onPress={handleSave} disabled={loading} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        flex: 1,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top', // Important for multiline text input on Android

    },
});

export default NewEntryScreen;