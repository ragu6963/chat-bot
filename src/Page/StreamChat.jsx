import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import MessageList from "../components/MessageList";
import ChatForm from "../components/ChatForm";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const chat = ai.chats.create({
  model: "gemini-2.5-flash",
});

export default function StreamChatPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // AI 응답 생성 함수
  async function generateAiResponse() {
    try {
      // AI 응답 생성
      const stream = await chat.sendMessageStream({
        message: prompt,
      });

      // 스트림 응답을 위한 빈 AI 메시지 먼저 추가
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      // 청크 누적용 문자열 변수
      let accumulatedResponse = "";

      for await (const chunk of stream) {
        // 스트림 청크 누적
        accumulatedResponse += chunk.text || "";

        // 메시지 상태 변경(함수형 업데이트)
        // prev 매개변수 : 이전 상태 데이터
        setMessages((prev) => {
          // newMessages : 새로운 배열 생성(복사)
          const newMessages = [...prev];

          // lastMessage : 마지막 메시지 메모리 주소 참조
          const lastMessage = newMessages[newMessages.length - 1];

          // AI 메시지인 경우 누적된 청크로 마지막 메세지 변경
          if (lastMessage["role"] === "ai") {
            lastMessage.content = accumulatedResponse;
          }

          // 마지막 메세지만 변경된 새로운 배열 반환
          return newMessages;
        });
      }
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
