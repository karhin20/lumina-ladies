import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
    className?: string;
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

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
                toast({
                    title: "Link copied",
                    description: "Product link copied to clipboard",
                });
            } else {
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
    };

    const handleClick = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed:', err);
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    };

    return (
        <Button
            variant={variant}
            size={showLabel ? "default" : size}
            className={className}
            onClick={handleClick}
        >
            <Share2 className={`${showLabel ? "w-4 h-4 mr-2" : "w-4 h-4"}`} />
            {showLabel && <span>{label}</span>}
        </Button>
    );
};

export default ShareButton;
