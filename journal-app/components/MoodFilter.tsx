import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors, moodFilterStyles } from '../constants/Styles';

interface MoodCount {
    mood: string;
    count: number;
}

interface MoodFilterProps {
    moods: MoodCount[];
    selectedMood: string | null;
    onSelectMood: (mood: string | null) => void;
    totalCount: number;
}

const MoodFilter: React.FC<MoodFilterProps> = ({ 
    moods, 
    selectedMood, 
    onSelectMood,
    totalCount 
}) => {
    const getMoodColor = (mood: string) => {
        switch (mood.toLowerCase()) {
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

    return (
        <View style={moodFilterStyles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Pressable
                    style={[
                        moodFilterStyles.moodOption,
                        selectedMood === null && moodFilterStyles.selectedMoodOption
                    ]}
                    onPress={() => onSelectMood(null)}
                >
                    <Text style={[
                        moodFilterStyles.moodText,
                        selectedMood === null && moodFilterStyles.selectedMoodText
                    ]}>
                        All ({totalCount})
                    </Text>
                </Pressable>

                {moods.map(({ mood, count }) => (
                    <Pressable
                        key={mood}
                        style={[
                            moodFilterStyles.moodOption,
                            selectedMood === mood && moodFilterStyles.selectedMoodOption,
                            { backgroundColor: getMoodColor(mood) }
                        ]}
                        onPress={() => onSelectMood(mood)}
                    >
                        <Text style={[
                            moodFilterStyles.moodText,
                            selectedMood === mood && moodFilterStyles.selectedMoodText
                        ]}>
                            {mood} ({count})
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
};

export default MoodFilter;