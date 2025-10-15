import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Chip, Searchbar, Button, Avatar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import * as SocialSlice from '../store/slices/socialSlice';
import { format, parseISO } from 'date-fns';

console.log('SocialSlice imports: ', SocialSlice);

export default function SocialScreen() {
  const dispatch = useDispatch();
  const { feed, searchResults, loading } = useSelector((state) => state.social);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = () => {
    dispatch(SocialSlice.fetchFeed());
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      dispatch(SocialSlice.searchUsers(query));
    } else {
      dispatch(SocialSlice.clearSearchResults());
    }
  };

  const handleFollow = async (userId) => {
    try {
      await dispatch(SocialSlice.followUser(userId)).unwrap();
      dispatch(SocialSlice.clearSearchResults());
      setSearchQuery('');
      setShowSearch(false);
      loadFeed();
    } catch (error) {
      alert('Failed to follow user');
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      run: '🏃',
      bike: '🚴',
      swim: '🏊',
      strength: '💪',
      workout_completed: '✅',
      workout_planned: '📅',
    };
    return icons[type] || '🏋️';
  };

  const renderActivity = ({ item }) => {
    const activityDate = parseISO(item.createdAt);
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.activityHeader}>
            <Avatar.Text 
              size={40} 
              label={item.user.name.charAt(0).toUpperCase()} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text variant="titleSmall" style={styles.userName}>
                {item.user.name}
              </Text>
              <Text variant="bodySmall" style={styles.activityTime}>
                {format(activityDate, 'MMM dd, h:mm a')}
              </Text>
            </View>
          </View>

          <View style={styles.activityContent}>
            <Text variant="bodyMedium">
              {getActivityIcon(item.type)} {item.content}
            </Text>
            
            {item.workout && (
              <View style={styles.workoutDetails}>
                {item.workout.duration && (
                  <Chip icon="clock-outline" compact style={styles.detailChip}>
                    {item.workout.duration} min
                  </Chip>
                )}
                {item.workout.distance && (
                  <Chip icon="map-marker-distance" compact style={styles.detailChip}>
                    {item.workout.distance} mi
                  </Chip>
                )}
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderSearchResult = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.searchResultContent}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={40} 
              label={item.name.charAt(0).toUpperCase()} 
            />
            <View style={styles.userDetails}>
              <Text variant="titleSmall">{item.name}</Text>
              <Text variant="bodySmall" style={styles.email}>
                {item.email}
              </Text>
            </View>
          </View>
          <Button mode="contained" onPress={() => handleFollow(item.id)}>
            Follow
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Activity Feed
        </Text>
        <Button
          mode="text"
          onPress={() => setShowSearch(!showSearch)}
          textColor="#fff"
          style={styles.searchButton}
        >
          {showSearch ? 'Cancel' : 'Find Friends'}
        </Button>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search users..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>
      )}

      {showSearch && searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <FlatList
          data={feed}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadFeed} />
          }
          ListEmptyComponent={
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  {showSearch
                    ? 'Search for users to follow'
                    : 'Follow friends to see their activity! Tap "Find Friends" to get started.'}
                </Text>
              </Card.Content>
            </Card>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6200ee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchButton: {
    marginLeft: 8,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    elevation: 0,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
  },
  activityTime: {
    color: '#666',
  },
  activityContent: {
    marginTop: 4,
  },
  workoutDetails: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  detailChip: {
    height: 28,
  },
  searchResultContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  email: {
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
});