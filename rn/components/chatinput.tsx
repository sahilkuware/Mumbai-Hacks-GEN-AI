// App.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet
} from "react-native";
import axios from "axios";

export default function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: string; text: string }[]
  >([]);

  const handleSend = async () => {
    if (message.trim()) {
      // Display user's message in the chat
      setChatHistory([...chatHistory, { sender: "User", text: message }]);

      try {
        // Send the message to the Flask backend
        const response = await axios.post("http://10.0.2.2:5000/chat", {
          message
        });

        // Display the AI response in the chat
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "AI", text: response.data.reply }
        ]);
      } catch (error) {
        console.error("Error communicating with backend:", error);
      }

      // Clear input field
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Chat with Ai!</Text>
      <ScrollView style={styles.chatContainer}>
        {chatHistory.map((chat, index) => (
          <Text
            key={index}
            style={chat.sender === "User" ? styles.userText : styles.aiText}
          >
            {chat.sender}: {chat.text}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={(text) => setMessage(text)}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  chatContainer: { flex: 1, marginBottom: 20 },
  userText: {
    alignSelf: "flex-end",
    backgroundColor: "#d1e7dd",
    padding: 8,
    marginVertical: 4,
    borderRadius: 8
  },
  aiText: {
    alignSelf: "flex-start",
    backgroundColor: "#e2e3e5",
    padding: 8,
    marginVertical: 4,
    borderRadius: 8
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10
  },
  headerText: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold"
  }
});
