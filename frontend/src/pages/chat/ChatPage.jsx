import { useEffect, useRef, useState } from "react";
import { MessageSquareText, SendHorizonal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SectionHeader from "@/components/shared/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";

import {
  createConversation,
  getConversation,
  listConversations,
  sendMessage,
} from "@/services/chatService";

function ChatPage() {
  const { accessToken } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // Load conversations
  useEffect(() => {
    listConversations(accessToken)
      .then(async (items) => {
        setConversations(items);

        if (items[0]) {
          const conversation = await getConversation(
            items[0].id,
            accessToken
          );

          setActive(conversation);
        }
      })
      .catch(() => {
        setError("Unable to load conversations.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [accessToken]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [active?.messages]);

  // Create new conversation
  async function newConversation() {
    try {
      setError("");

      const item = await createConversation(
        "New conversation",
        accessToken
      );

      setConversations((current) => [
        item,
        ...current,
      ]);

      setActive({
        ...item,
        messages: [],
      });
    } catch {
      setError("Unable to create a conversation.");
    }
  }

  // Select conversation
  async function selectConversation(id) {
    try {
      setError("");

      const conversation = await getConversation(
        id,
        accessToken
      );

      setActive(conversation);
    } catch {
      setError("Unable to open this conversation.");
    }
  }

  // Send message
  async function submit(event) {
    event.preventDefault();

    const content = draft.trim();

    if (!content || !active || sending) {
      return;
    }

    setError("");
    setDraft("");
    setSending(true);

    // Show user's message immediately
    const temporaryUserMessage = {
      id: `temp-user-${Date.now()}`,
      conversation_id: active.id,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setActive((current) => ({
      ...current,
      messages: [
        ...(current.messages || []),
        temporaryUserMessage,
      ],
    }));

    try {
      // Backend saves user message and generates AI response
      const assistantMessage = await sendMessage(
        active.id,
        content,
        accessToken
      );

      // Add AI response after generation
      setActive((current) => ({
        ...current,
        messages: [
          ...(current.messages || []),
          assistantMessage,
        ],
      }));
    } catch {
      setError("Unable to generate a response.");

      // Remove temporary user message if request failed
      setActive((current) => ({
        ...current,
        messages: (current.messages || []).filter(
          (message) =>
            message.id !== temporaryUserMessage.id
        ),
      }));
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-slate-400">
        Loading conversations...
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.3fr_1fr]">

      {/* Conversations */}
      <Card className="border-white/10 bg-slate-900/70">
        <CardHeader>
          <SectionHeader
            eyebrow="Conversations"
            title="Threads"
            description="Your AI conversations are saved securely."
          />
        </CardHeader>

        <CardContent className="space-y-3">

          <Button
            onClick={newConversation}
            className="w-full"
          >
            New conversation
          </Button>

          {conversations.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                selectConversation(item.id)
              }
              className={`w-full rounded-2xl border p-3 text-left text-sm transition ${
                active?.id === item.id
                  ? "border-violet-400/30 bg-violet-500/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <MessageSquareText className="mr-2 inline h-4 w-4 text-violet-300" />

              {item.title}
            </button>
          ))}

        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="border-white/10 bg-slate-900/70">

        <CardHeader>
          <SectionHeader
            eyebrow="AI mentor"
            title={
              active?.title ||
              "No conversation selected"
            }
            description="Your AI career mentor."
          />
        </CardHeader>

        <CardContent>

          {error && (
            <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Messages */}
          <div className="min-h-72 max-h-[65vh] space-y-5 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/70 p-5">

            {active?.messages?.length ? (
              active.messages.map((message) => {

                const isUser =
                  message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? "bg-violet-600/20 text-violet-100"
                          : "bg-white/5 text-slate-300"
                      }`}
                    >

                      {/* User message */}
                      {isUser ? (
                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {message.content}
                        </p>
                      ) : (

                        /* AI message */
                        <div className="prose prose-invert prose-sm max-w-none leading-6">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>

                      )}

                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex min-h-64 items-center justify-center">
                <p className="text-sm text-slate-500">
                  Ask your AI mentor anything about your career.
                </p>
              </div>
            )}

            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />

          </div>

          {/* Sending indicator */}
          {sending && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
              AI mentor is thinking...
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={submit}
            className="mt-4 flex gap-3"
          >
            <Input
              value={draft}
              onChange={(event) =>
                setDraft(event.target.value)
              }
              placeholder="Ask your AI career mentor..."
              disabled={!active || sending}
            />

            <Button
              type="submit"
              disabled={
                !active ||
                sending ||
                !draft.trim()
              }
            >
              <SendHorizonal className="mr-2 h-4 w-4" />

              {sending
                ? "Thinking..."
                : "Send"}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}

export default ChatPage;