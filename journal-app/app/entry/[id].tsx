import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Button, ActivityIndicator } from 'react-native';
import { supabase } from './../../lib/supabase';
import { useAuth } from './../../context/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { analyzeMood } from './../../lib/gemini';
import { colors, globalStyles } from './../../constants/Styles';
import { Entry } from './../../types/Entry';
import LoadingIndicator from './../../components/LoadingIndicator';


const EntryScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const { user } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false); //for loading state in deleting

    useEffect(() => {
        const fetchEntry = async () => {
            setLoading(true);
            try {
                if (!user) return;
                const { data, error } = await supabase
                    .from('entries')
                    .select('*')
                    .eq('id', id)
                    .eq('user_id', user.id) // Ensure user owns the entry
                    .single(); // Use .single() for retrieving one entry

                if (error) {
                    throw error;
                }
                if (data) {
                    setEntry(data as Entry);
                    setEditedContent(data.content)
                }
            } catch (error: any) {
                console.error("Error fetching entry:", error);
                Alert.alert("Error fetching entry", error.message)
            } finally {
                setLoading(false);
            }
        };

        fetchEntry();
    }, [id, user]);


    const handleUpdate = async () => {
        if (!user || !entry) return;
    
        setLoading(true);
        try {
            const { primaryMood, moodScores } = await analyzeMood(editedContent);
    
            // Cast moodScores to the required type
            const typedMoodScores = moodScores as Entry['mood_score'];
    
            const { error } = await supabase
                .from('entries')
                .update({ 
                    content: editedContent, 
                    mood: primaryMood, 
                    mood_score: typedMoodScores 
                })
                .eq('id', id)
                .eq('user_id', user.id);
    
            if (error) {
                throw error;
            }
            // Update local entry state with cast type
            setEntry({ 
                ...entry, 
                content: editedContent, 
                mood: primaryMood, 
                mood_score: typedMoodScores 
            });
    
            setIsEditing(false);
    
        } catch (error: any) {
            Alert.alert("Error", error.message)
            console.error('Error updating entry:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user || !entry) return;

        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this entry?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete", onPress: async () => {
                        setIsDeleting(true)
                        try {
                            const { error } = await supabase
                                .from('entries')
                                .delete()
                                .eq('id', id)
                                .eq('user_id', user.id); // Ensure ownership

                            if (error) {
                                throw error;
                            }
                            router.back(); // Navigate back to the list

                        } catch (error: any) {
                            Alert.alert("Error", error.message);
                            console.error('Error deleting entry:', error);
                        } finally {
                            setIsDeleting(false)
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!entry) {
        return <Text>Entry not found.</Text>;
    }
    const moodColor = getMoodColor(entry.mood);

    return (
        <View style={globalStyles.container}>
            <View style={[styles.moodBanner, { backgroundColor: moodColor }]}>
                <Text style={styles.moodText}>{entry.mood}</Text>
            </View>
            {isEditing ? (
                <>
                    <TextInput
                        style={styles.input}
                        multiline
                        value={editedContent}
                        onChangeText={setEditedContent}
                    />
                    <Button title="Save Changes" onPress={handleUpdate} disabled={loading} />
                    <Button title='Cancel' onPress={() => {
                        setIsEditing(false)
                        setEditedContent(entry.content)
                    }} />
                </>
            ) : (
                <>
                    <Text style={styles.date}>{new Date(entry.created_at).toLocaleDateString()}</Text>
                    <Text style={styles.content}>{entry.content}</Text>
                    <View style={styles.buttonsContainer}>

                        <Button title="Edit" onPress={() => setIsEditing(true)} />
                        {isDeleting ? <ActivityIndicator /> : <Button title="Delete" onPress={handleDelete} color="red" />}
                    </View>
                </>
            )}
        </View>
    );
};
const getMoodColor = (mood: string) => {
    switch (mood) {
        case 'happy': return colors.happy;
        case 'sad': return colors.sad;
        case 'angry': return colors.angry;
        case 'anxious': return colors.anxious;
        case 'calm': return colors.calm;
        case 'joyful': return colors.joyful;
        case 'fearful': return colors.fearful;
        default: return 'gray';
    }
};

const styles = StyleSheet.create({
    moodBanner: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    moodText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 5,
    },
    content: {
        fontSize: 16,
        marginBottom: 20,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        minHeight: 150,  // Give it some height
        textAlignVertical: 'top'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});

export default EntryScreen;