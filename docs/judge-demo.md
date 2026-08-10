# ApexRadio AI — Judge & Mentor Demo Guide (2-Minute Presentation)

This document provides a **click-by-click presentation script** optimized for hackathon judging panels, live stage presentations, and mentor evaluations.

---

## ⏱️ The 15-Second Hook (Opening Pitch)

> *"In Formula 1, race engineers monitor over 300 telemetry sensors, but they completely miss the most volatile sensor in the car: the driver’s vocal stress. When a driver's voice starts shaking under high-G braking, a lockup is seconds away. **ApexRadio AI** is the pit wall's silent co-driver — transcribing team radio, quantifying biometric vocal stress, and correlating tension directly with lap pace loss to deliver tactical decision support before mistakes happen."*

---

## 🎯 Click-by-Click Demo Flow (2 Minutes)

| Time | Screen & URL | Action | What to Say & Highlight |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:20** | **Landing Page** (`/`) | Scroll through Hero, Problem, & 5-Step Pipeline &rarr; Click **"Enter Pit Wall Console"** | *"Here is the 5-step pipeline: Radio Ingestion &rarr; Whisper STT &rarr; Emotion Detection &rarr; Lap Telemetry Correlation &rarr; Tactical AI Directive. Notice our clean, high-precision Linear + Notion design language."* |
| **0:20 - 0:45** | **Overview Dashboard** (`/dashboard`) | Point to **Driver Status (78%)**, **Risk Score (61%)**, and **Active Alerts** | *"We are currently monitoring Max Verstappen on Lap 18 of the Silverstone GP. Notice our **Driver Status** gauge flagged at **78% Stress**, our **Performance Risk Score** escalated to **61% (High)**, and our live **Recharts Pace vs Moving Average** curve showing the lap time drop."* |
| **0:45 - 1:10** | **Radio Analysis** (`/dashboard/radio`) | Click sample preset (*Lap 18 Turn 4 Understeer*) & play audio scrub | *"In our Radio Analyzer, Hugging Face Whisper transcribes: 'Front left is completely gone guys, massive understeer in Turn 4'. Our acoustic model extracts **Pitch Jitter (+42.5 Hz)** and **Speech Cadence (185 WPM)** with **94.2% model confidence**, detecting severe cognitive overload."* |
| **1:10 - 1:30** | **Lap Performance** (`/dashboard/performance`) | Hover over the Recharts pace curve & highlight the **Correlation Panel** | *"Our Correlation Engine combines that vocal stress with CAN bus lap telemetry. Notice how the 5-lap moving average drops by **+1.82s**, specifically driven by a +0.51s degradation in Sector 2 apex exit. The explanation panel clearly shows why the risk score was generated."* |
| **1:30 - 1:50** | **AI Alerts Center** (`/dashboard/alerts`) | Filter by **Critical** & click **"Acknowledge Directive"** | *"Our Alerts Center organizes directives into 4 prioritized tiers. Here, the AI immediately directs the engineer: 'Enforce radio silence through Sector 2 braking sequence and prepare Lap 21 pit window for Hard compound'. 1-click acknowledge resolves the directive."* |
| **1:50 - 2:00** | **Race Timeline** (`/dashboard/timeline`) | Scroll chronological event stream | *"The complete race story is captured from Lights Out on Lap 1 to the Lap 18 AI directive in a multi-track stream uniting radio speech, emotion spikes, lap deltas, and pit strategy."* |

---

## 🏆 Final Impact Statement (Closing)

> *"By uniting speech AI with vehicle telemetry, ApexRadio AI transforms reactive pit walls into proactive decision engines — saving tires, preventing costly lockups, and winning races from the pit wall."*

---

## 💡 Pro Tips for Judges' Questions

1. **How is the AI integrated?**
   - *"We built a dedicated client in our Express backend connecting to Hugging Face's `openai/whisper-large-v3` for speech transcription and `j-hartmann/emotion-english-distilroberta-base` for vocal emotion classification, complete with timeout control and domain fallbacks."*
2. **Why is it a multi-factor correlation score?**
   - *"A driver shouting doesn't always mean a slow lap. Our Correlation Engine weights vocal stress (40%), lap pace loss (35%), consecutive radio callouts (15%), and sector trends (10%) to prevent false alarms."*
3. **What is Demo Mode?**
   - *"The top header has a one-click **Demo Mode** switch that instantly pre-loads the full 18-lap Silverstone GP scenario with real telemetry and audio presets for rapid testing without requiring manual file uploads."*
