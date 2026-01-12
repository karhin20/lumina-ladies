import React from 'react';
import { Share2, Link as LinkIcon, Facebook, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Simple Twitter/X Icon
const XTwitter = ({ className }: { className?: string }) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const WhatsApp = ({ className }: { className?: string }) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
    className?: string; // Allow button styling
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    showLabel?: boolean;
    label?: string;
}

const ShareButton = ({
    title,
    text,
    url = window.location.href,
    className,
    variant = "outline",
    size = "icon",
    showLabel = false,
    label = "Share"
}: ShareButtonProps) => {
    const { toast } = useToast();

    const handleShare = async () => {
        // 1. Try Native Share
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });
                return; // Success
            } catch (error) {
                // User could have cancelled, or error. If error, fall through to modal.
                if ((error as Error).name !== 'AbortError') {
                    console.error('Share failed:', error);
                } else {
                    return; // User cancelled
                }
            }
        }

        // Fallback: This button acts as the Trigger for the Dialog if native share fails OR isn't called immediately
        // Ideally, we want the trigger to OPEN the dialog if navigator.share is missing.
        // But React event handlers can't easily conditionally change the Dialog open state *instead* of running navigator.share.
        // PATTERN: We'll make this component ALWAYS render the Dialog, but the trigger button's onClick will try Native first.
        // If native works, we e.preventDefault() on the dialog opening? 
        // Actually, shadcn Dialog Trigger is declarative. 

        // BETTER UX: Just us a controlled Dialog.
    };

    const [isOpen, setIsOpen] = React.useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        // Try native share first
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                // If successful, we don't open the modal
                return;
            } catch (err) {
                // If user ignored/cancelled, we stop.
                // If feature failed, we *could* open modal as fallback.
                // But usually navigator.share presence means it works.
                // Let's assume on Desktop if navigator.share is missing we open modal.
            }
        }

        // If no native share (Desktop), Open Modal
        setIsOpen(true);
    };

    const copyToClipboard = async () => {
        try {
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
                toast({
                    title: "Link copied",
                    description: "Product link copied to clipboard",
                });
            } else {
                // Fallback for non-secure contexts or older browsers
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (successful) {
                    toast({
                        title: "Link copied",
                        description: "Product link copied to clipboard",
                    });
                } else {
                    throw new Error('Copy command failed');
                }
            }
        } catch (err) {
            console.error('Clipboard copy failed:', err);
            toast({
                title: "Copy failed",
                description: "Your browser restricted copying. Please copy manually.",
                variant: "destructive"
            });
        }
        setIsOpen(false);
    };

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: <WhatsApp className="w-5 h-5" />,
            href: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
        },
        {
            name: "Facebook",
            icon: <Facebook className="w-5 h-5" />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        },
        {
            name: "X / Twitter",
            icon: <XTwitter className="w-5 h-5" />,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        },
        {
            name: "Email",
            icon: <Mail className="w-5 h-5" />,
            href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={variant}
                    size={showLabel ? "default" : size}
                    className={className}
                    onClick={handleClick}
                >
                    <Share2 className={`${showLabel ? "w-4 h-4 mr-2" : "w-4 h-4"}`} />
                    {showLabel && <span>{label}</span>}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share this product</DialogTitle>
                    <DialogDescription>
                        Share "{title}" with your friends.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {shareLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-4 rounded-lg border hover:bg-muted transition-colors"
                        >
                            {link.icon}
                            <span className="font-medium">{link.name}</span>
                        </a>
                    ))}
                    <button
                        onClick={copyToClipboard}
                        className="col-span-2 flex items-center justify-center gap-2 p-4 rounded-lg border bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                        <LinkIcon className="w-5 h-5" />
                        <span className="font-medium">Copy Link</span>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareButton;
