import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/shared/lib";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-20 text-center",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="mb-6 rounded-full bg-muted p-6"
      >
        <Icon className="h-16 w-16 text-muted-foreground" />
      </motion.div>
      <h3 className="mb-2 text-2xl font-semibold">{title}</h3>
      <p className="mb-6 max-w-md text-muted-foreground">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
