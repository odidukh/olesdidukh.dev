'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Clock,
  Loader2,
  CheckCheck,
} from 'lucide-react';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import type { ContactSubmission } from '@/lib/supabase/types';

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] =
    useState<ContactSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    setMessages((data as ContactSubmission[]) || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const supabase = createClient();
    await supabase
      .from('contact_submissions')
      .update({ read: true })
      .eq('id', id);

    setMessages(messages.map(m => (m.id === id ? { ...m, read: true } : m)));
  };

  const markAsReplied = async (id: string) => {
    const supabase = createClient();
    await supabase
      .from('contact_submissions')
      .update({ replied: true })
      .eq('id', id);

    setMessages(messages.map(m => (m.id === id ? { ...m, replied: true } : m)));
  };

  const deleteMessage = async (id: string) => {
    setDeleteLoading(true);
    const supabase = createClient();
    await supabase.from('contact_submissions').delete().eq('id', id);

    setMessages(messages.filter(m => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
    setDeleteTarget(null);
    setDeleteLoading(false);
  };

  const handleSelectMessage = (message: ContactSubmission) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Contact form submissions
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary/10 text-primary">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl overflow-hidden">
          {messages.length > 0 ? (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {messages.map(message => (
                <button
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
                  className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 ${message.read ? 'text-muted-foreground' : 'text-primary'}`}
                    >
                      {message.read ? (
                        <MailOpen className="w-5 h-5" />
                      ) : (
                        <Mail className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`font-medium truncate ${
                            message.read
                              ? 'text-foreground'
                              : 'text-foreground font-semibold'
                          }`}
                        >
                          {message.name}
                        </p>
                        {message.replied && (
                          <CheckCheck className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {message.email}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {message.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No messages yet</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Message Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {selectedMessage.name}
                    </h2>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!selectedMessage.replied && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsReplied(selectedMessage.id)}
                      >
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Mark Replied
                      </Button>
                    )}
                    <a href={`mailto:${selectedMessage.email}`}>
                      <Button size="sm">
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-error"
                      onClick={() => setDeleteTarget(selectedMessage.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    {selectedMessage.read ? (
                      <>
                        <MailOpen className="w-4 h-4 text-muted-foreground" />
                        Read
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 text-primary" />
                        Unread
                      </>
                    )}
                  </span>
                  {selectedMessage.replied && (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCheck className="w-4 h-4" />
                      Replied
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select a message to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {deleteTarget && (
        <DeleteConfirmDialog
          title="Delete Message"
          description="This action cannot be undone"
          itemName={
            messages.find(m => m.id === deleteTarget)?.name || 'this message'
          }
          onConfirm={() => deleteMessage(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
