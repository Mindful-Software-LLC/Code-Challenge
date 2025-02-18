import { StyleSheet } from 'react-native';

interface Colors {
  primary: string;
  background: string;
  cardBackground: string;
  text: string;
  happy: string;
  sad: string;
  angry: string;
  anxious: string;
  calm: string;
  joyful: string;
  fearful: string;
}

export const colors: Colors = {  // Explicitly type 'colors'
    primary: '#007bff',
    background: '#f0f0f0',
    cardBackground: '#ffffff',
    text: '#333333',
    happy: '#fdd835',
    sad: '#42a5f5',
    angry: '#ef5350',
    anxious: '#ffa726',
    calm: '#66bb6a',
    joyful: '#ffee58',
    fearful: '#9575cd',
};

export const globalStyles = StyleSheet.create({ // No need for explicit typing here
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.text,
    },
    text: {
        fontSize: 16,
        color: colors.text,
    },
});

export const authStyles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    link: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});

export const settingsStyles = StyleSheet.create({
    section: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    email: {
        fontSize: 16,
        marginBottom: 20,
        color: 'gray',
    },
});

export const homeStyles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
    },
    linkText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export const moodFilterStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 10,
        marginBottom: 10,
    },
    moodOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: 'gray',
    },
    selectedMoodOption: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    moodText: {
        color: 'black',
    },
    selectedMoodText: {
        fontWeight: 'bold',
    },
});