import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  where,
} from 'firebase/firestore';

const ChatScreen = ({ route }) => {
  const { apartmentId, receiverId } = route.params;
  const senderId = auth.currentUser.uid;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const chatId = [senderId, receiverId].sort().join('_'); // consistent ID

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(newMessages);
    });

    return unsubscribe;
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId,
      receiverId,
      apartmentId,
      timestamp: serverTimestamp()
    });

    setText('');
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.senderId === senderId ? styles.sent : styles.received]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A' },
  messageList: { padding: 10 },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  sent: { backgroundColor: '#00C9A7', alignSelf: 'flex-end' },
  received: { backgroundColor: '#2A2A2A', alignSelf: 'flex-start' },
  messageText: { color: '#fff' },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1A1A1A',
  },
  input: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    color: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#00C9A7',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
