import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2, MessageSquare, Image as ImageIcon, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

function MessageBubble({ message, isOwn }) {
  const initials = (message.senderName || message.senderEmail || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
        isOwn ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
      }`}>
        {initials}
      </div>

      {/* Message */}
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-2 mb-0.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs font-semibold text-slate-700">
            {message.senderName || message.senderEmail}
          </span>
          <span className="text-[10px] text-slate-400">
            {message.created_date ? format(new Date(message.created_date), 'h:mm a') : ''}
          </span>
        </div>
        <div className={`rounded-2xl px-4 py-2 ${
          isOwn 
            ? 'bg-amber-500 text-white rounded-tr-sm' 
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        {message.attachments?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1.5">
            {message.attachments.map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noopener noreferrer" 
                className="block w-24 h-24 rounded-lg overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DateSeparator({ date }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
        {format(new Date(date), 'EEEE, MMM d')}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

export default function ChatWindow({ job, messages, currentUserEmail, onSendMessage, loading }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    setSending(true);
    await onSendMessage(trimmed, attachments);
    setText('');
    setAttachments([]);
    setSending(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setAttachments(prev => [...prev, ...urls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!job) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">Select a job to start chatting</p>
          <p className="text-xs text-slate-300 mt-1">Messages are organized by job</p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = [];
  let lastDate = '';
  for (const msg of messages) {
    const msgDate = msg.created_date ? format(new Date(msg.created_date), 'yyyy-MM-dd') : '';
    if (msgDate && msgDate !== lastDate) {
      groupedMessages.push({ type: 'date', date: msg.created_date });
      lastDate = msgDate;
    }
    groupedMessages.push({ type: 'message', data: msg });
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-amber-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-800 truncate">{job.name}</h3>
          <p className="text-xs text-slate-400">
            {job.status} • {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50/50 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No messages yet</p>
            <p className="text-xs text-slate-300 mt-1">Send the first message for this job</p>
          </div>
        ) : (
          groupedMessages.map((item, idx) => {
            if (item.type === 'date') {
              return <DateSeparator key={`date-${idx}`} date={item.date} />;
            }
            const msg = item.data;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderEmail?.toLowerCase() === currentUserEmail?.toLowerCase()}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 flex-wrap">
          {attachments.map((url, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-slate-200">
        <div className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple
            accept="image/*"
          />
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 text-slate-400 hover:text-slate-600"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
          </Button>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-slate-50 min-h-[40px] max-h-[120px]"
            style={{ height: 'auto', overflow: 'auto' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <Button
            onClick={handleSend}
            disabled={sending || (!text.trim() && attachments.length === 0)}
            size="icon"
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 rounded-xl"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}