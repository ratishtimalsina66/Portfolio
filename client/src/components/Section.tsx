import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export function Section({ id, className, children, delay = 0 }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-32", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12 md:mb-16 max-w-2xl">
      <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
