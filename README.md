# 🚀 KNOVO — Knowledge + Voice = AI-powered Quiz Platform  

![Knovo Logo](./public/demo.png)  

AI-powered **voice-based quiz platform** for interactive, adaptive learning and competitions.  

# 🏆 Built for the Prism GenAI Hackathon 2025 – Round 2  

🌐 **Live Deployment** → [Knovo App](https://knovo-dhlb.vercel.app)  
![Prism](./public/prism_logo.png)

---

## 🌟 Overview  

Knovo transforms traditional quizzing into an **immersive, voice-driven learning experience**.  
Instead of static question banks, it dynamically generates quizzes from **titles, PDFs, or keywords** using **Gemini AI**. Learners attempt quizzes **through voice**, get **real-time adaptive feedback**, and track their performance via leaderboards.  

Our mission: **Make learning inclusive, engaging, and personalized** — for students, educators, and especially the **visually impaired** who benefit from a screen-free, hands-free quiz experience.  

---

## 🎯 Key Features  

- 🎤 **Voice-based Quizzing** – Speak your answers, get instant AI-powered responses.  
- 📝 **Custom Quiz Generation** – Create quizzes via form-based input or voice prompts powered by Google Gemini API.
- 📊 **Detailed Feedback** – Beyond accuracy: fluency, clarity, and comprehension are analyzed.
- 👀 **Accessibility** – Voice-based workflows tailored for visually impaired learners.  
- 👥 **Multiplayer & Leaderboards** – Each quiz has its own leaderboard with top scorers.  
- ⚡ **Challenge Modes** – Adaptive difficulty quizzes on specific topics or mixed sets, powered by **Vapi workflows**.  

---

## 👥 Stakeholders  

- **Students & Learners** → Engage with fun, adaptive quizzes.  
- **Educators & Institutions** → Gamify learning & track progress.  
- **Visually Impaired Users** → Screen-free, accessible voice-first learning.  
- **Communities & Peers** → Compete and improve together.  

---

## 🛠️ Tech Stack  

- **Frontend**: Next.js + TailwindCSS  
- **Backend**: Node.js  
- **AI/Voice**: Gemini API + Vapi SDK + Deepgram ASR + LLMs (OpenAI/Anthropic)  
- **Database & Auth**: Firebase (Firestore + Auth)  
- **Hosting**: Vercel  
- **Version Control**: GitHub  

---

## ⚙️ Architecture  

![Architecture](./public/arch.jpg)  

1. **User Authentication** → Secure sign-in via Firebase.  
2. **Quiz Creation** → Quizzes generated dynamically from inputs (title, PDF, keywords) using Gemini API.  
3. **Voice-based Quiz Attempt** → Conducted via Vapi SDK with Deepgram for speech recognition.  
4. **Adaptive Engine** → Adjusts quiz difficulty after first 5 questions.  
5. **Feedback Module** → AI evaluates knowledge + vocal clarity and stores results in Firestore.  
6. **Leaderboard** → Real-time score tracking and display per quiz.  

---

## 📌 How It Works  

1. **Join & Select** a quiz/challenge.  
2. **Generate Quiz** via form inputs (title/PDF) or voice prompts.  
3. **Attempt Quiz** using voice — answers analyzed in real-time.  
4. **Adaptive Difficulty** kicks in to match your level.  
5. **Get Detailed Feedback** on accuracy, fluency, and clarity.  
6. **Leaderboard Updates** instantly with scores.  

---

## 🎥 Demo  

- **Demo Video** → *(Add YouTube/Drive public link)*  
- **Live App** → [Knovo on Vercel](https://knovo-dhlb.vercel.app)  

---

## 📂 Submission Details  

- **Team Name**: The Immortals  
- **College**: VIT Vellore  
- **Theme**: Multimodal AI  
- **Team Lead**: Divesh Singh  

---

## ✅ Evaluation Highlights  

- **Working Prototype** – Fully functional voice quiz system.  
- **Technical Depth** – Multimodal AI with adaptive workflows.  
- **UX** – Engaging, gamified quiz with smooth UI.  
- **Accessibility** – Voice-based workflows for visually impaired users.  
- **Docs & Presentation** – Architecture, assumptions, and demo video provided.  

---
