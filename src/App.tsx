import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/pages/HomePage";
import { ChatPage } from "@/pages/ChatPage";
import { AssistantPage } from "@/pages/AssistantPage";
import { FineTunePage } from "@/pages/FineTunePage";

import '@/App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="fine-tune" element={<FineTunePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;