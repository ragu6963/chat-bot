import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

export default function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 응답 메시지가 추가되면 최하단으로 스크롤
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      {/* 하단 스크롤 유지를 위한 빈 div */}
      <div ref={messagesEndRef}></div>
    </div>
  );
}
