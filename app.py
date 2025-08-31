from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import mysql.connector
import requests
import json
import os
from datetime import datetime
import hashlib
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'ai_study_buddy')
}
print("🔍 DEBUG ENV VALUES")
print("DB_HOST:", os.getenv("DB_HOST"))
print("DB_USER:", os.getenv("DB_USER"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))
print("DB_NAME:", os.getenv("DB_NAME"))


# Hugging Face API configuration
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')

# Intasend configuration
INTASEND_API_KEY = os.getenv('INTASEND_API_KEY')
INTASEND_PUBLISHABLE_KEY = os.getenv('INTASEND_PUBLISHABLE_KEY')

def get_db_connection():
    """Create and return database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None

def init_database():
    """Initialize database tables"""
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor()
        
        # Create flashcards table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS flashcards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                subject VARCHAR(50) NOT NULL,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                notes_hash VARCHAR(64) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id VARCHAR(100) DEFAULT 'anonymous'
            )
        """)
        
        # Create users table for premium features
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                subscription_status ENUM('free', 'premium') DEFAULT 'free',
                subscription_expires TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create payments table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                amount DECIMAL(10,2) NOT NULL,
                currency VARCHAR(3) DEFAULT 'KES',
                status VARCHAR(20) DEFAULT 'pending',
                intasend_reference VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)
        
        connection.commit()
        cursor.close()
        connection.close()

def generate_questions_from_notes(notes, subject):
    """Generate quiz questions using Hugging Face API"""
    if not HUGGINGFACE_API_KEY:
        return None
    
    # Create a prompt for question generation
    prompt = f"""
    Based on the following {subject} notes, generate 5 multiple choice questions with answers.
    Make the questions precise and relevant to the content.
    
    Notes: {notes}
    
    Generate questions in this format:
    Q1: [Question]
    A: [Answer]
    
    Q2: [Question]
    A: [Answer]
    
    And so on...
    """
    
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_length": 1000,
            "temperature": 0.7,
            "do_sample": True
        }
    }
    
    try:
        response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            result = response.json()
            return result[0]['generated_text']
        else:
            print(f"Hugging Face API error: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error calling Hugging Face API: {e}")
        return None

def parse_questions(text):
    """Parse generated questions into structured format"""
    questions = []
    lines = text.split('\n')
    current_question = None
    
    for line in lines:
        line = line.strip()
        if line.startswith('Q') and ':' in line:
            if current_question:
                questions.append(current_question)
            current_question = {'question': line.split(':', 1)[1].strip(), 'answer': ''}
        elif line.startswith('A:') and current_question:
            current_question['answer'] = line.split(':', 1)[1].strip()
    
    if current_question:
        questions.append(current_question)
    
    return questions[:5]  # Return max 5 questions

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/generate_flashcards', methods=['POST'])
def generate_flashcards():
    """Generate flashcards from notes"""
    try:
        data = request.get_json()
        subject = data.get('subject')
        notes = data.get('notes')
        
        if not subject or not notes:
            return jsonify({'error': 'Subject and notes are required'}), 400
        
        # Generate questions using Hugging Face
        generated_text = generate_questions_from_notes(notes, subject)
        
        if not generated_text:
            # Fallback questions if API fails
            questions = [
                {
                    'question': f'What is the main topic discussed in the {subject} notes?',
                    'answer': 'The notes cover various aspects of the subject matter.'
                },
                {
                    'question': f'How does {subject} relate to real-world applications?',
                    'answer': 'The subject has practical applications in various fields.'
                },
                {
                    'question': f'What are the key concepts in {subject}?',
                    'answer': 'Key concepts include fundamental principles and theories.'
                },
                {
                    'question': f'Why is {subject} important for students?',
                    'answer': 'It provides essential knowledge and skills for academic success.'
                },
                {
                    'question': f'What methods are used in {subject}?',
                    'answer': 'Various scientific and analytical methods are employed.'
                }
            ]
        else:
            questions = parse_questions(generated_text)
        
        # Save to database
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            notes_hash = hashlib.sha256(notes.encode()).hexdigest()
            
            for q in questions:
                cursor.execute("""
                    INSERT INTO flashcards (subject, question, answer, notes_hash, user_id)
                    VALUES (%s, %s, %s, %s, %s)
                """, (subject, q['question'], q['answer'], notes_hash, 'anonymous'))
            
            connection.commit()
            cursor.close()
            connection.close()
        
        return jsonify({'questions': questions})
    
    except Exception as e:
        print(f"Error generating flashcards: {e}")
        return jsonify({'error': 'Failed to generate flashcards'}), 500

@app.route('/get_flashcards/<subject>')
def get_flashcards(subject):
    """Get saved flashcards for a subject"""
    try:
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("""
                SELECT question, answer FROM flashcards 
                WHERE subject = %s 
                ORDER BY created_at DESC 
                LIMIT 20
            """, (subject,))
            
            flashcards = cursor.fetchall()
            cursor.close()
            connection.close()
            
            return jsonify({'flashcards': flashcards})
        else:
            return jsonify({'error': 'Database connection failed'}), 500
    
    except Exception as e:
        print(f"Error fetching flashcards: {e}")
        return jsonify({'error': 'Failed to fetch flashcards'}), 500

@app.route('/premium')
def premium():
    """Premium subscription page"""
    return render_template('premium.html')

@app.route('/create_payment', methods=['POST'])
def create_payment():
    """Create Intasend payment"""
    try:
        data = request.get_json()
        amount = data.get('amount', 1000)  # KES 1000 for premium
        
        # Intasend payment creation logic
        headers = {
            'Authorization': f'Bearer {INTASEND_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'amount': amount,
            'currency': 'KES',
            'payment_method': 'MPESA',
            'reference': f'AI_STUDY_BUDDY_{datetime.now().strftime("%Y%m%d%H%M%S")}',
            'redirect_url': request.host_url + 'payment_success',
            'webhook_url': request.host_url + 'payment_webhook'
        }
        
        # This is a simplified version - you'd need to implement the actual Intasend API call
        # For now, we'll simulate a successful payment creation
        
        return jsonify({
            'success': True,
            'payment_url': f'https://pay.intasend.com/pay/{payload["reference"]}',
            'reference': payload['reference']
        })
    
    except Exception as e:
        print(f"Error creating payment: {e}")
        return jsonify({'error': 'Failed to create payment'}), 500

@app.route('/payment_success')
def payment_success():
    """Payment success page"""
    return render_template('payment_success.html')

@app.route('/payment_webhook', methods=['POST'])
def payment_webhook():
    """Handle Intasend webhook"""
    # Implement webhook verification and payment status update
    return jsonify({'status': 'received'})

if __name__ == '__main__':
    init_database()
    app.run(debug=True, host='0.0.0.0', port=5000)
