"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/contact`);
        const data = await res.json();

        if (res.ok) {
          setMessages(Array.isArray(data.messages) ? data.messages : []);
        } else {
          toast.error({
            description: data.error || "Failed to load messages.",
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error({
          description: "Could not connect to server.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [toast]);

  const handleMarkAsResponded = async (id: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/contact/${id}/responded`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Update failed");
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, responded: true } : msg))
      );

      toast.success({
        description: "Message marked as responded.",
      });
    } catch (error: any) {
      toast.error({
        description: error.message || "Failed to update status.",
      });
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">📬 Contact Messages</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground italic">No messages yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>
                      {msg.firstName} {msg.lastName}
                    </TableCell>
                    <TableCell>{msg.subject}</TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {msg.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={msg.responded ? "default" : "secondary"}>
                        {msg.responded ? "Responded" : "New"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={msg.responded}
                        onClick={() => handleMarkAsResponded(msg.id)}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Mark Done
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}