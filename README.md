# ⚖️ IPC Finder

An intelligent web application that analyzes user-described incidents and suggests relevant **Indian Penal Code (IPC)** and **Bharatiya Nyaya Sanhita (BNS)** sections.

---

## 🚀 Overview

**IPC Finder** helps users understand which legal sections may apply to their situation by simply describing the problem in natural language (English or Hinglish).

It is designed for:

* Students learning law
* General public awareness
* Legal-tech experimentation
* FIR drafting assistance

---

## ✨ Features

* 🔍 **Text-based Crime Classification**

  * Input: Natural language description
  * Output: Relevant IPC/BNS sections

* 🧠 **Keyword + Pattern Matching Engine**

  * Fast and lightweight baseline AI

* 🌐 **Hinglish Support**

  * Example: *"mera phone chori ho gaya"*

* 📊 **Confidence Scoring**

  * Indicates how accurate the prediction is

* 📝 **FIR Draft Generator (Optional)**

  * Converts user input into FIR format

* 🔁 **Feedback System**

  * Improves accuracy over time

* 🛠️ **Admin Panel (Planned)**

  * Manage sections and mappings

---

## 🏗️ Tech Stack

### Frontend

* HTML, CSS, JavaScript
* (Optional) React.js / Next.js

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI / Logic

* Keyword Matching
* Pattern-based classification
* (Future) NLP / ML integration

---

## 📂 Project Structure

```
IPC-Finder/
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── backend/
│   ├── apiServer.js
│   ├── routes/
│   │   └── classify.js
│   ├── controllers/
│   └── models/
│
├── data/
│   ├── ipc_sections.json
│   └── keyword_mappings.json
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ipc-finder.git
cd ipc-finder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
```

### 4. Run the Server

```bash
npm start
```

Server will run on:

```
http://localhost:5000
```

---

## 📡 API Endpoints

### 🔹 POST `/api/classify`

**Request:**

```json
{
  "text": "Someone stole my phone"
}
```

**Response:**

```json
{
  "sections": [
    {
      "section": "379",
      "title": "Theft",
      "confidence": 0.92,
      "explanation": "Stealing movable property"
    }
  ]
}
```

---

### 🔹 GET `/api/sections/:id`

Returns details of a specific IPC section.

---

### 🔹 POST `/api/feedback`

Stores user feedback for improving accuracy.

---

## 🧪 Example Inputs

| Input                      | Expected Section |
| -------------------------- | ---------------- |
| Someone stole my phone     | 379              |
| He threatened to kill me   | 506              |
| A person cheated me online | 420              |
| Someone is stalking me     | 354D             |

---

## ⚠️ Disclaimer

This project is for **educational and informational purposes only**.
It does **not provide legal advice**. Always consult a qualified legal professional for real cases.
