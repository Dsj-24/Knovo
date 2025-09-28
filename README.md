# 🚀 KNOVO = Knowledge + Voice - AI-powered Voice Based Quiz Platform  

![Knovo Logo](./public/demo.png)  

# 🏆 Built for the Prism GenAI Hackathon 2025 – Round 2

🌐 **Live Deployment** → [Knovo App](https://knovo-dhlb.vercel.app)  
![Prism](./public/prism_logo.png)

---

## 🌟 Overview  

Knovo transforms traditional quizzing into an **immersive, voice-driven learning experience**.  
Instead of static question banks, it dynamically generates quizzes from **form input (titles, PDFs)** , or **voice input (Vapi Workflow)** using **Gemini AI**. Learners attempt quizzes in **voice** mode  with a **Vapi Agent (A Quizmaster)** , get **real-time feedback**, and compete with others via **leaderboards**.  

Our **Mission** / **Purpose**: Make learning **inclusive, engaging, and personalized** — for **students, educators,** and especially the **visually impaired** who benefit from a screen-free, hands-free quiz experience.  

---

---

## ⚙️ How to Set Up and Run the Project  

### 1. Clone the repository

```bash
git clone https://github.com/Dsj-24/Knovo.git
cd Knovo
```

### 2. Install all the dependencies

This command will download all the required dependencies , to still know about the most important ones, refer to the **requirements.txt** file in the root folder.

```bash
npm install
```

### 3. Configure Environment Variables

In the root folder , create **.envlocal** file and add the following:-

```env
FIREBASE_PROJECT_ID="Your Key"
FIREBASE_PRIVATE_KEY="Your Key"
FIREBASE_CLIENT_EMAIL="Your Key"
GOOGLE_GENERATIVE_AI_API_KEY="Your Key"
NEXT_PUBLIC_VAPI_WEB_TOKEN="Your Key"
NEXT_PUBLIC_VAPI_WORKFLOW_ID="Your Key"
NEXT_PUBLIC_VAPI_MISCELLANEOUS_ID="Your Key"
NEXT_PUBLIC_DEMO_WORKFLOW_ID="Your Key"
```

### ⚠️ Important Notice

- Please replace all environment variable values with **your own API keys** for services such as **Gemini** and **Vapi AI**.  
- For **Firebase** and **Vapi workflows** (`NEXT_PUBLIC_VAPI_*`), except the Vapi web token, you will need to use the keys provided by us. This is because the workflows and Firestore database indexes have been created under our account.  
- Alternatively, you may use our Special Setup guide mentioned in our Supplementary File or use **live deployment** to test the application without setting up your own environment:

👉 [Knovo on Vercel](https://knovo-dhlb.vercel.app)

### 4. Run the application

```bash
npm run dev
```

---

## 📂 Submission Details  

- **Team Name**: The Immortals  
- **College**: VIT Vellore  
- **Theme**: Multimodal AI  
- **Team Lead**: Divesh Singh  
- **Demo Video** → [Demo Video Drive Link](https://drive.google.com/file/d/1R6_TBxdgNVhlJ_yuLUonp0xZ7fI1BJAZ/view?usp=drivesdk)
- **Live App** → [Knovo on Vercel](https://knovo-dhlb.vercel.app)  
- **Supplementary File**: The_Immortals.pdf (inside root folder)

---
