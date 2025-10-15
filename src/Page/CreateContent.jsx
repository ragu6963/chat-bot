import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import MessageList from "../components/MessageList";
import ChatForm from "../components/ChatForm";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default function CreateContentPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // AI 응답 생성 함수
  async function generateAiResponse() {
    try {
      // AI 응답 생성
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setMessages((prev) => [...prev, { role: "ai", content: response.text }]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // 프롬프트가 비어있거나 로딩중이면 중지(return)
    if (!prompt.trim() || isLoading) return;

    // 메세지 내역 상태에 사용자 입력 프롬프트 추가(함수형 업데이트)
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    setPrompt("");
    setIsLoading(true);

    // AI 응답 생성
    await generateAiResponse();

    setIsLoading(false);
  }

  return (
    <>
      {/* 메시지 표현 컴포넌트 - 스크롤 가능 */}
      <MessageList messages={messages} />

      {/* 입력 폼 컴포넌트 - 하단 고정 */}
      <ChatForm
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
