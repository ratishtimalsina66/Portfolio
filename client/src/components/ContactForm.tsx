import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { insertMessageSchema, type InsertMessage } from "@shared/schema";
import { useContact } from "@/hooks/use-contact";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const mutation = useContact();
  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertMessage) => {
    mutation.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
            Name
          </label>
          <input
            {...form.register("name")}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all",
              form.formState.errors.name && "border-destructive focus:ring-destructive/10 focus:border-destructive"
            )}
            placeholder="John Doe"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
            Email
          </label>
          <input
            {...form.register("email")}
            type="email"
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all",
              form.formState.errors.email && "border-destructive focus:ring-destructive/10 focus:border-destructive"
            )}
            placeholder="john@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
          Message
        </label>
        <textarea
          {...form.register("message")}
          rows={5}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all resize-none",
            form.formState.errors.message && "border-destructive focus:ring-destructive/10 focus:border-destructive"
          )}
          placeholder="Tell me about your project..."
        />
        {form.formState.errors.message && (
          <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full md:w-auto px-8 py-4 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
