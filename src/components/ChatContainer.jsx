import { GoogleGenAI } from "@google/genai";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatForm from "./ChatForm";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const chat = ai.chats.create({
  model: "gemini-2.5-flash",
});

export default function ChatContainer() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 응답 메시지가 추가되면 최하단으로 스크롤
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="max-w-4xl h-dvh mx-auto flex flex-col border border-gray-300 ">
      {/* 메시지 표현 컴포넌트 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {/* 하단 스크롤 유지를 위한 빈 div */}
        <div ref={messagesEndRef}></div>
      </div>

      {/* 입력 폼 컴포넌트 */}
      <ChatForm
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
