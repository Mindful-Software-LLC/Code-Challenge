import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import JournalEntry from '../../components/JournalEntry';
import MoodFilter from '../../components/MoodFilter';
import { globalStyles, colors, homeStyles } from '../../constants/Styles';
import LoadingIndicator from '../../components/LoadingIndicator';
import { Entry } from '../../types/Entry';
import { Link } from 'expo-router';
import { useFocusEffect } from 'expo-router';

interface MoodCount {
    mood: string;
    count: number;
}

const HomeScreen: React.FC = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState(false);
    const [moodCounts, setMoodCounts] = useState<MoodCount[]>([]);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const { user } = useAuth();

    const calculateMoodCounts = (entriesData: Entry[]) => {
        const counts = entriesData.reduce((acc: { [key: string]: number }, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([mood, count]) => ({
            mood,
            count
        }));
    };

    const fetchEntries = async () => {
        setLoading(true);
        try {
            if (!user) return;

            let query = supabase
                .from('entries')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (selectedMood) {
                query = query.eq('mood', selectedMood);
            }

            const { data, error } = await query;

            if (error) throw error;

            if (data) {
                setEntries(data as Entry[]);
                
                // Calculate mood counts from all entries (not filtered)
                const { data: allData } = await supabase
                    .from('entries')
                    .select('*')
                    .eq('user_id', user.id);
                
                if (allData) {
                    setMoodCounts(calculateMoodCounts(allData as Entry[]));
                }
            }
        } catch (error: any) {
            console.error("Error fetching entries:", error);
            alert(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Use useFocusEffect to refresh data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchEntries();
            }
        }, [user, selectedMood])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchEntries();
    };

    if (!user) {
        return <LoadingIndicator />;
    }

    if (loading && !refreshing) {
        return <LoadingIndicator />;
    }

    if (entries.length === 0) {
        return (
            <View style={[globalStyles.container, homeStyles.emptyContainer]}>
                <Text style={homeStyles.emptyText}>No data yet. Please add a new entry </Text>
                <Link href="/(tabs)/new" asChild>
                    <Pressable>
                        <Text style={homeStyles.linkText}>here</Text>
                    </Pressable>
                </Link>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <MoodFilter 
                moods={moodCounts}
                selectedMood={selectedMood}
                onSelectMood={setSelectedMood}
                totalCount={entries.length}
            />
            <FlatList
                data={entries}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <JournalEntry entry={item} />}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

export default HomeScreen;