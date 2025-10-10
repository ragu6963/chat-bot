export default function ChatForm({ prompt, setPrompt, onSubmit, isLoading }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-2 p-4 bg-white">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            isLoading ? "답변을 생성하고 있습니다..." : "메시지를 입력하세요..."
          }
          disabled={isLoading}
          className="flex-grow-1 px-3 py-2 border border-gray-300 "
        />
        <input
          type="submit"
          value="전송"
          disabled={isLoading || !prompt.trim()}
          className="px-4 py-2 border border-gray-300 cursor-pointer"
        />
      </div>
    </form>
  );
}
