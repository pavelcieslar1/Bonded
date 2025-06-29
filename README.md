# 💕 Bonded - Modern Dating App with AI Support

**Bonded** is an advanced dating application built on ASP.NET Core 8.0 with a modern TypeScript frontend. The project combines traditional dating features with advanced AI capabilities for better matching and communication.

## ✨ Features

### 🎯 Intelligent Matching
- **Local matching** - Find people in the same city
- **Global matching** - Worldwide search with filters
- **Premium matching** - Advanced analysis with AI summary
- **Smart algorithm** - Combines personality tests, interests, lifestyle, and preferences

### 🧠 Personality Test
- Categorized questions (emotional intelligence, communication, values)
- Automatic scoring in different categories
- Identification of strengths and weaknesses

### 🤖 AI Support (Google Gemini)
- **Match analysis** - Detailed compatibility breakdown
- **Horoscopes** - Daily horoscopes for all zodiac signs
- **Message suggestions** - AI-assisted chat tips

### 💬 Real-time Chat
- SignalR hub for instant communication
- Group chats
- Message history

### 👤 User Management
- Registration and login
- Profile management with photos
- Role-based access (Admin, Premium, User)

## 🏗️ Architecture

### Backend
- **Framework**: ASP.NET Core 8.0 with Entity Framework Core
- **Database**: SQL Server with Code-First approach
- **Authentication**: ASP.NET Core Identity
- **Real-time communication**: SignalR
- **AI integration**: Google Gemini API

### Frontend
- **Language**: TypeScript with ES6 modules
- **Styling**: Bootstrap + custom CSS
- **Communication**: REST API + SignalR
- **Security**: DOMPurify for sanitization

## 📝 Matching Algorithm

### Weight distribution:
1. **Personality compatibility** (40%)
   - Comparison of answers in categories
   - Bonus for similar values, penalty for conflicts

2. **Interest compatibility** (30%)
   - Shared hobbies (bonus)
   - Conflicting interests (penalty)

3. **Lifestyle compatibility** (20%)
   - Age, city, lifestyle
   - Relationship preferences

4. **Static factors** (10%)
   - Education, religion, orientation

## 🔒 Security

- ASP.NET Core Identity for authentication
- Role-based authorization
- DOMPurify for XSS protection
- HTTPS enforcement
- SQL injection protection via Entity Framework

## 📊 Technologies

| Component | Technology |
|-----------|------------|
| Backend | ASP.NET Core 8.0, Entity Framework Core |
| Frontend | TypeScript, Bootstrap |
| Real-time | SignalR |
| AI | Google Gemini API |
| Database | SQL Server |
| Hosting | MonsterASP |

## 📄 License

This project is proprietary software. All rights reserved.
- Private, non-commercial use only
- No modification, distribution, or commercial use permitted
- For licensing inquiries, please contact the copyright holder

---