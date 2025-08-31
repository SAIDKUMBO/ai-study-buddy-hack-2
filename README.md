# AI Study Buddy - Your Smart Learning Companion

![AI Study Buddy](https://img.shields.io/badge/AI-Powered%20Learning-blue?style=for-the-badge&logo=robot)
![SDG 4](https://img.shields.io/badge/SDG-4%20Quality%20Education-green?style=for-the-badge)
![Flask](https://img.shields.io/badge/Backend-Flask-red?style=for-the-badge&logo=flask)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange?style=for-the-badge&logo=mysql)

## 🌟 Overview

AI Study Buddy is a cutting-edge web application designed to revolutionize the way students learn and study. Built as part of the Sustainable Development Goals (SDG 4 - Quality Education), this application leverages artificial intelligence to transform study notes into interactive flashcards, making learning more engaging and effective.

## 🚀 Features

### ✨ Core Features
- **AI-Powered Question Generation**: Advanced AI analyzes your notes and generates precise, relevant questions
- **Interactive Flashcards**: Beautiful, animated flashcards with smooth flip transitions
- **Multi-Subject Support**: Geography, Chemistry, Physics, Biology, History, and CRE
- **Smart Storage**: Automatic saving and organization of flashcards for future revision
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 🎯 Premium Features
- **Unlimited Flashcards**: Generate as many flashcards as you need
- **Priority Processing**: Faster AI processing with priority queue access
- **Advanced Analytics**: Track your learning progress with detailed insights
- **PDF Export**: Export flashcards to PDF for offline study
- **Custom Study Schedules**: Create personalized study plans
- **Progress Tracking**: Monitor your learning journey

### 💳 Payment Integration
- **Intasend Integration**: Secure payment processing via M-PESA and card payments
- **Multiple Plans**: Monthly (KES 1,000) and Annual (KES 10,000) subscription options
- **Secure Transactions**: Industry-standard encryption and security measures

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with modern structure
- **CSS3**: Advanced animations, transitions, and responsive design
- **JavaScript**: Interactive functionality and API integration
- **Font Awesome**: Beautiful icons and visual elements

### Backend
- **Python Flask**: Lightweight and powerful web framework
- **MySQL**: Robust database for storing flashcards and user data
- **Hugging Face API**: AI-powered question generation
- **Intasend API**: Payment processing and integration

### Design & UX
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Accessibility**: WCAG compliant design for inclusive learning
- **Performance**: Optimized for fast loading and smooth interactions

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.8+**
- **MySQL 8.0+**
- **pip** (Python package manager)
- **Git** (for version control)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-study-buddy.git
cd ai-study-buddy
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Setup
```sql
-- Create MySQL database
CREATE DATABASE ai_study_buddy;
CREATE USER 'ai_study_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ai_study_buddy.* TO 'ai_study_user'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Environment Configuration
```bash
# Copy the example environment file
cp env_example.txt .env

# Edit .env with your configuration
nano .env
```

### 6. API Keys Setup

#### Hugging Face API
1. Visit [Hugging Face](https://huggingface.co/)
2. Create an account and generate an API key
3. Add the key to your `.env` file

#### Intasend API
1. Visit [Intasend](https://intasend.com/)
2. Create an account and get your API keys
3. Add the keys to your `.env` file

### 7. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
ai-study-buddy/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── env_example.txt        # Environment variables template
├── README.md             # Project documentation
├── templates/            # HTML templates
│   ├── index.html        # Main page
│   ├── premium.html      # Premium subscription page
│   └── payment_success.html # Payment success page
├── static/               # Static assets
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   └── js/
│       ├── script.js     # Main JavaScript
│       └── premium.js    # Premium page JavaScript
└── .gitignore           # Git ignore file
```

## 🎮 Usage Guide

### For Students

1. **Select Your Subject**: Choose from Geography, Chemistry, Physics, Biology, History, or CRE
2. **Paste Your Notes**: Copy and paste your study materials into the text area
3. **Generate Flashcards**: Click "Generate Flashcards" and let AI create questions
4. **Study Interactively**: Flip through flashcards, navigate with arrow keys or swipe gestures
5. **Save Progress**: All flashcards are automatically saved for future revision

### For Premium Users

1. **Upgrade to Premium**: Click "Go Premium" to access advanced features
2. **Choose Your Plan**: Select monthly or annual subscription
3. **Complete Payment**: Use M-PESA or card payment via Intasend
4. **Unlock Features**: Enjoy unlimited flashcards, analytics, and more

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Flask secret key | Yes |
| `DB_HOST` | MySQL host | Yes |
| `DB_USER` | MySQL username | Yes |
| `DB_PASSWORD` | MySQL password | Yes |
| `DB_NAME` | MySQL database name | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | Yes |
| `INTASEND_API_KEY` | Intasend API key | Yes |
| `INTASEND_PUBLISHABLE_KEY` | Intasend publishable key | Yes |

### Customization

#### Adding New Subjects
1. Update the subject dropdown in `templates/index.html`
2. Add subject-specific styling in `static/css/style.css`
3. Update the AI prompt in `app.py` if needed

#### Modifying Payment Plans
1. Edit pricing in `templates/premium.html`
2. Update payment amounts in `static/js/premium.js`
3. Modify subscription logic in `app.py`

## 🧪 Testing

### Manual Testing
1. Test flashcard generation with different subjects
2. Verify payment flow (use test credentials)
3. Check responsive design on different devices
4. Test keyboard navigation and touch gestures

### Automated Testing (Future Enhancement)
```bash
# Install testing dependencies
pip install pytest pytest-flask

# Run tests
pytest tests/
```

## 🚀 Deployment

### Production Setup

1. **Server Requirements**
   - Ubuntu 20.04+ or CentOS 8+
   - Python 3.8+
   - MySQL 8.0+
   - Nginx (recommended)

2. **Deployment Steps**
   ```bash
   # Install system dependencies
   sudo apt update
   sudo apt install python3-pip python3-venv mysql-server nginx

   # Clone and setup application
   git clone https://github.com/yourusername/ai-study-buddy.git
   cd ai-study-buddy
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

   # Configure environment
   cp env_example.txt .env
   # Edit .env with production values

   # Setup Nginx
   sudo cp nginx.conf /etc/nginx/sites-available/ai-study-buddy
   sudo ln -s /etc/nginx/sites-available/ai-study-buddy /etc/nginx/sites-enabled/
   sudo systemctl restart nginx

   # Run with Gunicorn
   pip install gunicorn
   gunicorn -w 4 -b 127.0.0.1:8000 app:app
   ```

3. **SSL Certificate**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📊 Analytics & Monitoring

### Google Analytics Integration
Add your GA tracking ID to the environment variables:
```javascript
// Add to templates
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Key Metrics to Track
- Flashcard generation rate
- Premium conversion rate
- User engagement time
- Subject popularity
- Payment success rate

## 🔒 Security Considerations

- **API Key Protection**: Never commit API keys to version control
- **Database Security**: Use strong passwords and limit database access
- **HTTPS**: Always use HTTPS in production
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Sanitize user-generated content

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check MySQL service
   sudo systemctl status mysql
   
   # Verify credentials in .env
   mysql -u your_user -p your_database
   ```

2. **API Key Issues**
   - Verify Hugging Face API key is valid
   - Check Intasend API credentials
   - Ensure environment variables are loaded

3. **Payment Processing**
   - Use test credentials for development
   - Verify webhook endpoints are accessible
   - Check Intasend dashboard for transaction status

### Debug Mode
```bash
# Enable debug mode
export FLASK_DEBUG=1
python app.py
```

## 📈 Future Enhancements

### Planned Features
- [ ] User authentication and profiles
- [ ] Social learning features
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Integration with LMS platforms
- [ ] AI-powered study recommendations
- [ ] Collaborative study groups

### Technical Improvements
- [ ] Microservices architecture
- [ ] Redis caching
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Performance optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face**: For providing the AI models and API
- **Intasend**: For payment processing services
- **Font Awesome**: For beautiful icons
- **Flask Community**: For the excellent web framework
- **SDG 4**: For inspiring quality education initiatives

## 📞 Support

For support and questions:

- **Email**: support@aistudybuddy.com
- **Phone**: +254 700 000 000
- **Website**: https://aistudybuddy.com
- **Documentation**: https://docs.aistudybuddy.com

## 🌍 Impact

This project contributes to **SDG 4: Quality Education** by:
- Making learning more accessible and engaging
- Providing personalized study tools
- Supporting students in developing countries
- Promoting digital literacy and technology adoption
- Creating scalable educational solutions

---

**Made with ❤️ for better education worldwide**

© 2025 AI Study Buddy. All rights reserved.
