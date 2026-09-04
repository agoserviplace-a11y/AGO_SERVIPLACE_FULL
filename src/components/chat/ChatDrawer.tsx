import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  User,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { dbService } from '../../lib/dbService';
import { useAuth } from '../../context/AuthContext';
import { Conversation, Message } from '../../types';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId?: string | null;
  targetUserName?: string | null;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUserName
}) => {
  const { currentUser, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user conversations
  useEffect(() => {
    if (!currentUser || !isOpen) return;

    const q = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Conversation));
      // Sort by updatedAt
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setConversations(list);

      // If target user provided, find or trigger conversation
      if (targetUserId && targetUserId !== currentUser.uid) {
        dbService.getOrCreateConversation(
          currentUser.uid,
          targetUserId,
          `Chat con ${targetUserName || 'Usuario'}`
        ).then(convId => {
          setActiveConvId(convId);
        });
      } else if (!activeConvId && list.length > 0) {
        setActiveConvId(list[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentUser, isOpen, targetUserId]);

  // Listen to messages for active conversation
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, `conversations/${activeConvId}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Message));
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });

    return () => unsubscribe();
  }, [activeConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !activeConvId) return;

    const text = inputText.trim();
    setInputText('');
    try {
      await dbService.sendMessage(
        activeConvId,
        currentUser.uid,
        userProfile?.displayName || 'Usuario',
        text
      );
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!isOpen) return null;

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#0D0D0E] h-full shadow-2xl flex flex-col sm:flex-row border-l border-[#27272A] animate-in slide-in-from-right duration-200">

        {/* Left column: Conversations list */}
        <div className="w-full sm:w-72 border-r border-[#27272A] flex flex-col bg-[#0A0A0B] shrink-0">
          <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Mensajes AGO</h2>
            </div>
            <button
              onClick={onClose}
              className="sm:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Aún no tienes conversaciones activas.
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    activeConvId === conv.id
                      ? 'bg-[#161618] shadow-xs border border-[#27272A] text-white'
                      : 'hover:bg-[#161618]/60 text-slate-400'
                  }`}
                >
                  <p className="text-xs font-bold truncate text-white mb-0.5">
                    {conv.contextTitle || 'Conversación'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {conv.lastMessage || 'Conversación iniciada'}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right column: Active Chat box */}
        <div className="flex-1 flex flex-col h-full bg-[#0D0D0E]">

          {/* Chat Header */}
          <div className="p-4 border-b border-[#27272A] flex items-center justify-between bg-[#0D0D0E]">
            <div>
              <h3 className="text-xs font-bold text-white">
                {activeConv?.contextTitle || 'Chat Seguro'}
              </h3>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Mensajería interna protegida
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161618]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs text-slate-500">
                <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
                <span>Inicia la conversación para coordinar los detalles de tu servicio.</span>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === currentUser?.uid;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-500 font-medium mb-0.5 px-1">
                      {isMine ? 'Tú' : msg.senderName}
                    </span>
                    <div
                      className={`max-w-[85%] sm:max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                        isMine
                          ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-[#161618] border border-[#27272A] text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-0.5 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-[#27272A] bg-[#0D0D0E] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje seguro..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#27272A] focus:outline-none focus:border-blue-500 bg-[#161618] text-white placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
