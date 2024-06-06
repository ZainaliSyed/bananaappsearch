import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, TextInput, Button, FlatList, Text, View, Alert, Modal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { store } from './src/redux/store';
import { setUsers, setSearchedUser } from './src/redux/actions';

const userData = require('./leaderboard.json');

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

const Main = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.get('users').toJS());
  const searchedUser = useSelector((state: any) => state.get('searchedUser'));
  const [username, setUsername] = useState('');
  const [sortOption, setSortOption] = useState('bananas');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = () => {
    const userDataArray = Object.values(userData);
    const userExists = userDataArray.some((user: any) => user.name.toLowerCase() === username.toLowerCase());

    if (!userExists) {
      Alert.alert('This user name does not exist! Please specify an existing user name!');
    } else {
      const sortedUsers = [...userDataArray].sort((a, b) => b.bananas - a.bananas);
      let topUsers = sortedUsers.slice(0, 10);
      const userIndex = sortedUsers.findIndex((user: any) => user.name.toLowerCase() === username.toLowerCase());

      if (userIndex >= 0 && userIndex < 10) {
        topUsers = sortedUsers.slice(0, 10); // user is already in top 10
      } else {
        topUsers = sortedUsers.slice(0, 9); // exclude the last one
        topUsers.push(sortedUsers[userIndex]); // include the searched user
      }

      topUsers = topUsers.map((user, index) => ({ ...user, rank: index + 1 }));
      dispatch(setUsers(topUsers));
      dispatch(setSearchedUser(username));
    }
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setModalVisible(false);
    let sortedUsers = [...users];

    if (option === 'name') {
      sortedUsers = sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'lowest') {
      sortedUsers = sortedUsers.sort((a, b) => a.bananas - b.bananas || a.name.localeCompare(b.name));
    } else {
      sortedUsers = sortedUsers.sort((a, b) => b.bananas - a.bananas);
    }

    dispatch(setUsers(sortedUsers));
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,margin :20 }}>
      <Row>
        <StyledTextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter user name"
        />
        <StyledButton title="Search" onPress={handleSearch} />
      </Row>
      <Row>
        <Text>Sort by: </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ borderWidth: 1, padding: 8 }}>
          <Text>{sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}</Text>
        </TouchableOpacity>
      </Row>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: 200, backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <TouchableOpacity onPress={() => handleSortChange('bananas')} style={{ padding: 10 }}>
              <Text style={{ color: 'black' }}>Bananas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSortChange('name')} style={{ padding: 10 }}>
              <Text style={{ color: 'black' }}>Name</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSortChange('lowest')} style={{ padding: 10 }}>
              <Text style={{ color: 'black' }}>Lowest</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 10, alignItems: 'center' }}>
              <Text style={{ color: 'black' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={users}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <View style={{ backgroundColor: item.name.toLowerCase() === searchedUser.toLowerCase() ? 'yellow' : 'transparent' }}>
            <Text style={{ color: item.name.toLowerCase() === searchedUser.toLowerCase() ? 'black' : 'white' }}>{item.rank}. {item.name} - {item.bananas}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StyledTextInput = styled.TextInput`
  border: 1px solid #000;
  padding: 8px;
  margin-right: 8px;
  flex: 1;
`;

const StyledButton = styled.Button``;

export default App;
