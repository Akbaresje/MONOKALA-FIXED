import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * @interface OrderConfirmationCardProps
 * @description Props for the OrderConfirmationCard component.
 * @property {string} orderId - The unique identifier for the order.
 * @property {string} paymentMethod - The method used for payment.
 * @property {string} dateTime - The date and time of the transaction.
 * @property {string} totalAmount - The total amount charged, formatted as a string (e.g., "$129").
 * @property {() => void} onGoToAccount - Callback function for the primary action button.
 * @property {string} [title] - Optional title text. Defaults to "Your order has been successfully submitted".
 * @property {string} [buttonText] - Optional text for the action button. Defaults to "Go to my account".
 * @property {React.ReactNode} [icon] - Optional custom icon. Defaults to a checkmark icon.
 * @property {string} [className] - Optional additional CSS classes for the card container.
 */
interface OrderConfirmationCardProps {
  orderId: string;
  paymentMethod: string;
  dateTime: string;
  totalAmount: string;
  onGoToAccount: () => void;
  title?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * A reusable UI component to display an order confirmation.
 * It's theme-adaptive, responsive, and includes subtle animations.
 */
export const OrderConfirmationCard: React.FC<OrderConfirmationCardProps> = ({
  orderId,
  paymentMethod,
  dateTime,
  totalAmount,
  onGoToAccount,
  title = "Your order has been successfully submitted",
  buttonText = "Go to my account",
  icon = <CheckCircle2 className="h-12 w-12 text-primary" strokeWidth={1.5} />,
  className,
}) => {
  const details = [
    { label: "Order ID", value: orderId },
    { label: "Payment Method", value: paymentMethod },
    { label: "Date & Time", value: dateTime },
    { label: "Total", value: totalAmount, isBold: true },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-live="polite"
        className={cn(
          "w-full max-w-sm rounded-[12px] border border-border bg-card text-card-foreground shadow-[0_18px_40px_-28px_rgba(26,26,26,0.55)] p-6 sm:p-8",
          className,
        )}
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          <motion.div variants={itemVariants}>{icon}</motion.div>

          <motion.h2
            variants={itemVariants}
            className="font-display text-2xl font-medium leading-snug text-card-foreground"
          >
            {title}
          </motion.h2>

          <motion.div variants={itemVariants} className="w-full space-y-4 pt-4">
            {details.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between border-b border-border pb-4 text-sm text-muted-foreground",
                  {
                    "border-none pb-0": index === details.length - 1,
                    "font-bold text-card-foreground": item.isBold,
                  },
                )}
              >
                <span className="smallcaps text-[10px] tracking-[0.18em]">{item.label}</span>
                <span
                  className={cn("text-right text-card-foreground/90", {
                    "font-display text-lg font-medium text-primary": item.isBold,
                  })}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="w-full pt-4">
            <Button onClick={onGoToAccount} className="w-full h-12 text-[12.5px]" size="lg">
              {buttonText}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
