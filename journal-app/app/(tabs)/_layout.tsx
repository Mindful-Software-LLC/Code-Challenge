import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './../../constants/Styles';
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'];

          if (route.name === 'index') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'new') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'alert';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Journal',
          headerShown: true
        }} 
      />
      {user && (
        <Tabs.Screen 
          name="new" 
          options={{ 
            title: 'New Entry',
            headerShown: true
          }} 
        />
      )}
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          headerShown: true
        }} 
      />
    </Tabs>
  );
}