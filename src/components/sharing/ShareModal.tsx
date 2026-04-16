'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { encodeProjection } from '@/lib/sharing/encoder';
import type { ProjectionConfig } from '@/types/projection';

export function ShareModal({
  config,
  open,
  onClose,
}: {
  config: ProjectionConfig;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const generate = async () => {
    const encoded = await encodeProjection(config);
    const shareUrl = `${window.location.origin}/projections#${encoded}`;
    setUrl(shareUrl);
  };

  const copy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md border-[var(--border-default)] bg-[var(--bg-surface)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">Share Projection</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)] text-sm">
            Generate a shareable URL. Anyone with the link can view your exact projection — no account required.
          </p>
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] mt-1.5 flex-shrink-0" />
            <p className="text-[var(--text-tertiary)] text-xs leading-relaxed">
              The full projection is encoded in the URL itself. No data is ever sent to a server.
            </p>
          </div>

          {!url ? (
            <Button
              onClick={generate}
              className="w-full bg-[var(--brand)] hover:bg-orange-600 text-white"
            >
              Generate Share URL
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-3">
                <code className="text-xs text-[var(--text-secondary)] flex-1 truncate">{url}</code>
                <button
                  onClick={copy}
                  className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] flex-shrink-0 transition-colors"
                  aria-label="Copy URL"
                >
                  {copied
                    ? <Check className="w-4 h-4 text-[var(--accent-green)]" />
                    : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <Button
                onClick={copy}
                variant="outline"
                className="w-full border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
