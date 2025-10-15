import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessage({ message }) {
  // 사용자 메세지 / AI 메세지 확인용 변수
  const isUser = message["role"] === "user";
  const isAi = message["role"] === "ai";

  return (
    // 메세지 role에 따라 정렬 방향 결정
    <div className={`mt-16 flex ${isUser ? "justify-end" : "justify-start"}`}>
      {/* AI 메세지 : 마크다운 표현 */}
      {/* 사용자 메세지 : 일반 텍스트 표현 */}
      {isAi ? (
        <div className="markdown-content max-w-[90%]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="p-3 border rounded-xl border-gray-300">
          {message.content}
        </div>
      )}
    </div>
  );
}
