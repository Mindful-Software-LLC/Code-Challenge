import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';

const LoadingIndicator: React.FC = () => { // No props needed
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingIndicator;