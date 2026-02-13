import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, X } from 'lucide-react';

export default function AdminReplyBox({ currentReply, onSend, isSending }) {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState(currentReply || '');

    if (currentReply && !isOpen) {
        return (
            <div className="mt-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">Admin Reply</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:bg-blue-100 px-2"
                        onClick={() => { setText(currentReply); setIsOpen(true); }}>
                        Edit
                    </Button>
                </div>
                <p className="text-sm text-blue-800">{currentReply}</p>
            </div>
        );
    }

    if (!isOpen) {
        return (
            <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs text-slate-400 hover:text-blue-600 gap-1"
                onClick={() => setIsOpen(true)}>
                <MessageSquare className="w-3.5 h-3.5" /> Reply
            </Button>
        );
    }

    return (
        <div className="mt-2 space-y-2">
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a reply to the employee..."
                className="text-sm min-h-[60px] resize-none"
                autoFocus
            />
            <div className="flex gap-1.5 justify-end">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsOpen(false)}>
                    <X className="w-3.5 h-3.5 mr-1" /> Cancel
                </Button>
                <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700" disabled={!text.trim() || isSending}
                    onClick={() => { onSend(text.trim()); setIsOpen(false); }}>
                    <Send className="w-3.5 h-3.5 mr-1" /> {isSending ? 'Sending...' : 'Send'}
                </Button>
            </div>
        </div>
    );
}