# BiteAI - AI Nutrition System 🥗

> Your personal AI nutritionist. Get custom meal plans tailored to your goals, powered by advanced machine learning.

![BiteAI Banner](public/logo.png)

## ✨ Features

### 🔐 Authentication & Profiles
*   **Secure Sign Up/Login**: Create personalized accounts with email & password.
*   **Multi-User Support**: Seamlessly switch between user profiles on the same device.
*   **Persistent Data**: Your profile, stats, and preferences are saved locally.

### 🍽️ AI Meal Planning
*   **Smart Diet Plans**: Personalized meal suggestions based on your age, weight, and goals (Weight Loss, Muscle Gain, etc.).
*   **Photo Upload**: Upload a photo of your meal to instantly log it (Simulated AI analysis).
*   **Dietary Preferences**: Support for Vegan, Keto, Paleo, and more.

### 🎨 Modern UI/UX
*   **Glassmorphism Design**: Sleek, modern interface with blurred glass effects.
*   **Smooth Animations**: Powered by `framer-motion` for fluid page transitions and scroll reveals.
*   **Interactive Components**:
    *   **Sparkling Buttons**: Custom shimmer effects on primary actions.
    *   **Particle Backgrounds**: Dynamic, floating particle effects.
    *   **Staggered Text**: Elegant text entrance animations.
    *   **Confetti Celebrations**: Rewards for completing goals!

### 📊 Dashboard & Tracking
*   **Hydration Tracker**: Log your daily water intake.
*   **Calorie & Macro Tracking**: Visualize your nutrition progress.
*   **Streak System**: Keep your momentum going with daily streak tracking.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **State Management**: React Context & LocalStorage
*   **Auth**: Client-side custom auth tailored for privacy.

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/0xKrishnaAI/my-ai-diet-app.git
    cd my-ai-diet-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the app live!

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── auth/             # Login & Signup pages
│   ├── dashboard/        # Main user dashboard
│   ├── onboarding/       # User setup flow
│   └── profile/          # User profile settings
├── components/           # Reusable UI components
│   ├── ui/               # Base UI elements (buttons, cards, etc.)
│   └── sections/         # Landing page sections
├── lib/                  # Utilities and logic
│   ├── auth.ts           # Authentication service
│   └── store.ts          # State management
└── public/               # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).