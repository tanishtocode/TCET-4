# 🍱 MealLink

### AI-Powered Surplus Food Matching Platform

🌐 **Live Demo:** https://tcet-4.onrender.com

MealLink is a web application that helps connect **surplus food donors** with **NGOs and organizations** that can collect and distribute the food.

Instead of manually searching for an organization after an event, a donor can describe the available food in normal language. MealLink uses AI to extract important information such as **food type, quantity, location, pickup deadline, and pickup details**, and then matches the donation with suitable NGOs.

---

## 🎯 Problem

Large amounts of edible food can remain after:

* Weddings
* Restaurants
* Catered events
* Parties
* College events
* Community gatherings

At the same time, NGOs and food distribution organizations need information such as:

* What food is available?
* How much food is available?
* Where is it located?
* When does it need to be collected?
* Can the organization collect it?

MealLink brings these two sides together in one platform.

---

## 💡 Solution

MealLink provides a simple workflow:

```text
Food Donor
    ↓
Describe Surplus Food
    ↓
AI Extracts Information
    ↓
Donor Reviews Information
    ↓
Donation Published
    ↓
Matching Engine Finds Suitable NGOs
    ↓
NGO Claims Donation
    ↓
Pickup / Status Tracking
    ↓
Impact Statistics
```

---

## ✨ Main Features

### 👤 Donor

* Email registration and login
* Create a surplus-food donation
* Describe food using natural language
* AI-powered information extraction
* Review and edit AI-generated information
* Publish donation
* View matching NGOs
* See why an NGO matches
* Track donation status

### 🏢 NGO

* NGO registration and login
* Organization address
* Food preferences
* Maximum food capacity
* Pickup capability
* View available donations
* View matching information
* Claim donations
* Update donation status

### 🤖 AI Extraction

The donor can enter a message such as:

> We have around 45 meals left from today's wedding at Royal Banquet Hall, Chakan. It's veg rice, dal, paneer and roti. Need pickup before 7:30 pm today. Food is packed in containers.

The AI extracts structured information such as:

```text
Quantity: 45 meals
Food: Rice, Dal, Paneer, Roti
Location: Royal Banquet Hall, Chakan
Pickup Deadline: 7:30 PM
Pickup Information: Packed in containers
```

The donor can review and edit the extracted information before publishing.

**AI does not automatically publish a donation.**

---

## 🧠 Matching System

MealLink uses a weighted matching system to find suitable NGOs.

The matching score considers:

| Factor            | Weight |
| ----------------- | -----: |
| Distance          |    30% |
| Capacity          |    25% |
| Food Type         |    20% |
| Pickup Capability |    15% |
| Time / Deadline   |    10% |

The application also provides explanations for the match so users can understand why an NGO was suggested.

---

## 🔄 Donation Status

A donation moves through a simple status workflow:

```text
Published
    ↓
Claimed
    ↓
Pickup Started
    ↓
Picked Up
    ↓
Completed
```

Expired donations are automatically handled by the system.

---

## 📊 Impact Dashboard

The Impact page displays real application statistics such as:

* Completed donations
* Meals donated
* NGOs involved
* Food successfully matched

This helps demonstrate the social impact created through the platform.

---

## 🛠️ Technology Stack

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Supabase
* PostgreSQL
* Supabase Authentication
* Row Level Security (RLS)
* Supabase Realtime
* Supabase Edge Functions

### AI

* Google Gemini API

### Geocoding

* OpenStreetMap Nominatim

### Development

* Git
* GitHub
* VS Code

### Deployment

* Vercel

---

## 📁 Project Structure

```text
MealLink/
│
├── src/
│   ├── components/
│   │   └── ui.tsx
│   │
│   ├── lib/
│   │   ├── ai.ts
│   │   ├── geo.ts
│   │   ├── match.ts
│   │   ├── supabase.ts
│   │   └── util.ts
│   │
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Auth.tsx
│   │   ├── Donor.tsx
│   │   ├── Ngo.tsx
│   │   └── Impact.tsx
│   │
│   ├── App.tsx
│   ├── store.tsx
│   └── types.ts
│
├── supabase/
│   ├── schema.sql
│   └── functions/
│       └── extract-donation/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/tanishtocode/TCET-4.git
```

Move into the project:

```bash
cd TCET-4
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do **not** commit `.env` to GitHub.

The `.env` file is ignored using `.gitignore`.

---

# 🗄️ Supabase Setup

MealLink uses Supabase for authentication, database storage, realtime updates, and backend functions.

### Database

Run the SQL from:

```text
supabase/schema.sql
```

inside the Supabase SQL Editor.

The database includes:

* User profiles
* NGOs
* Donations
* Row Level Security policies
* Donation claiming
* Donation status management
* Donation expiration
* Realtime updates
* Demo NGO records

---

# 🤖 AI Setup

MealLink uses a Supabase Edge Function to communicate with Gemini.

The deployed Edge Function is:

```text
clever-worker
```

The frontend calls this function through:

```text
src/lib/ai.ts
```

The Gemini API key is stored as a **Supabase Edge Function secret**.

It should **never be placed in the React frontend** or committed to GitHub.

Required Supabase secret:

```text
GEMINI_API_KEY
```

The application can attempt to discover available Gemini models if the configured/default model is unavailable.

---

# 🔐 Authentication

MealLink supports two primary roles:

```text
Donor
NGO
```

Users register using email authentication.

The application displays different functionality depending on the user's role.

---

# 🏢 NGO Registration

During NGO registration, the organization can provide information such as:

* Organization name
* Address
* Maximum capacity
* Accepted food types
* Pickup capability

This information is used by the matching system.

---

# 🍱 Creating a Donation

A donor:

1. Logs in.
2. Opens the donation workflow.
3. Enters a natural-language description.
4. AI extracts structured information.
5. Reviews the extracted information.
6. Corrects anything necessary.
7. Confirms the donation.
8. Publishes it.

This human-review step helps prevent incorrect AI extraction from being automatically published.

---

# 🔎 NGO Matching

After a donation is published, MealLink evaluates suitable NGOs using:

```text
Distance
Capacity
Food compatibility
Pickup capability
Time/deadline
```

The result includes an explanation of the matching factors.

---

# ⚡ Realtime Updates

Supabase Realtime is used so that donation information can update without requiring the user to manually refresh the page.

This is useful for:

* New donations
* Donation claims
* Status changes
* Expired donations

---

# 🛡️ Security

MealLink uses several security mechanisms:

* Supabase Authentication
* PostgreSQL Row Level Security
* Protected user roles
* Server-side AI API key
* Database functions for controlled donation operations
* `.env` protection through `.gitignore`

API keys and secrets should never be committed to the repository.

---

# ▶️ Run Locally

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🏗️ Build for Production

Create a production build:

```bash
npm run build
```

The production files will be generated inside:

```text
dist/
```

---

# 🌐 Vercel Deployment

MealLink can be deployed using Vercel.

### Build settings

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Add the required `VITE_` environment variables to the Vercel project.

The Gemini API key should remain in Supabase and should **not** be added to the frontend environment variables.

After deployment, configure the production URL in:

```text
Supabase
→ Authentication
→ URL Configuration
```

Add the Vercel URL to the allowed redirect URLs.

---

# 🧪 Testing the Full Flow

A basic end-to-end test can be performed using:

### Donor

1. Create a donor account.
2. Log in.
3. Enter surplus-food information.
4. Run AI extraction.
5. Review the result.
6. Publish the donation.

### NGO

1. Create an NGO account using another browser/incognito window.
2. Log in.
3. Open the donation feed.
4. Find the published donation.
5. Claim the donation.
6. Progress through the pickup statuses.

### Impact

After completing a donation:

1. Open the Impact page.
2. Verify the statistics have updated.

---

# ⚠️ Important Note

MealLink is a **matching and coordination platform**.

The application does **not certify food safety**.

Users and organizations are responsible for following applicable food-safety practices and making their own decisions about whether food is suitable for distribution.

---

# 🎯 Project Goal

The goal of MealLink is to demonstrate how **AI + real-time data + intelligent matching** can be used to reduce food wastage and improve coordination between food donors and NGOs.

Instead of asking:

> "Who can take this leftover food?"

MealLink helps turn that information into a structured donation and identify organizations that may be able to collect it.

---

## 👨‍💻 Project

**MealLink**

AI-powered surplus food matching platform.

**Repository:**
https://github.com/tanishtocode/TCET-4

Built with:

```text
React + TypeScript
Supabase
Gemini AI
Tailwind CSS
Vite
```

---

## 📜 License

This project was created as a competition/project submission and is intended for demonstration and educational purposes.
