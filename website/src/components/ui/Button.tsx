import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer relative overflow-hidden group';

        const variants = {
            primary: 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white border-0',
            secondary: 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20',
            outline: 'border border-primary text-primary hover:bg-primary/10',
            ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
        };

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={twMerge(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                <span className="relative z-10 flex items-center gap-2">{children}</span>
                {variant === 'primary' && (
                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-secondary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                )}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
