# app.py
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
from groq import Groq
from langchain.chains import ConversationChain
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()
groq_api_key = os.environ.get('GROQ_API_KEY', 'default_api_key')
if groq_api_key == 'default_api_key':
    raise ValueError("GROQ_API_KEY environment variable is not set.")

app = Flask(__name__)
app.secret_key = 'your_secret_key'
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    
    if 'chat_history' not in session:
        session['chat_history'] = []
    
    # Add the new user input to the chat history
    session['chat_history'].append({'human': user_input})

    memory = ConversationBufferWindowMemory(k=10)  # Set the memory length
    for message in session['chat_history']:
        memory.save_context({'input': message['human']}, {'output': message.get('AI','')})

    groq_chat = ChatGroq(
        groq_api_key=groq_api_key, 
        model_name='llama3-8b-8192'
    )

    conversation = ConversationChain(
        llm=groq_chat,
        memory=memory
    )

    response = conversation(user_input)['response']
    
    # Add the bot response to the chat history
    session['chat_history'].append({'human': user_input, 'AI': response})

    return jsonify({"reply": response})

if __name__ == '__main__':
    app.run(debug=True)
