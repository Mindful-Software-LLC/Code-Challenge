import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from './../constants/Styles';
import { useRouter } from 'expo-router';

interface JournalEntryProps {
    entry: {
        id: string;
        created_at: string;
        content: string;
        mood: string;
    };
}

const JournalEntry: React.FC<JournalEntryProps> = ({ entry }) => {
    const router = useRouter();

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

    const moodColor = getMoodColor(entry.mood);
    const handlePress = () => {
        router.push(`/entry/${entry.id}`);
    };

    return (
        <Pressable style={[styles.container, { borderColor: moodColor }]} onPress={handlePress}>
            <View style={[styles.moodIndicator, { backgroundColor: moodColor }]}></View>
            <View style={styles.contentContainer}>
                <Text style={styles.date}>{new Date(entry.created_at).toLocaleDateString()}</Text>
                <Text style={styles.content} numberOfLines={2}>{entry.content}</Text>
                <Text style={[styles.mood, { color: moodColor }]}>{entry.mood}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 5,
        overflow: 'hidden', // Clip the rounded corners
    },
    moodIndicator: {
        width: 10,

    },
    contentContainer: {
        flex: 1,
        padding: 10,

    },
    date: {
        fontSize: 12,
        color: 'gray',
    },
    content: {
        fontSize: 14,
        marginVertical: 4,
    },
    mood: {
        fontSize: 12,
        fontWeight: 'bold',

    },
});

export default JournalEntry;