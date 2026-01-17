import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";
import type { EntryContext } from "react-router";

export const streamTimeout = 5000;

// Simple bot detection function to avoid isbot ESM/CJS issues
function isBotUserAgent(userAgent: string | null): boolean {
    if (!userAgent) return false;
    const botPatterns = /bot|crawl|spider|slurp|googlebot|bingbot|yandex|baidu|duckduck|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|redditbot|slackbot|whatsapp|applebot/i;
    return botPatterns.test(userAgent);
}

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
    loadContext: Record<string, unknown>
) {
    return new Promise((resolve, reject) => {
        let shellRendered = false;
        const userAgent = request.headers.get("user-agent");

        // Ensure requests from bots and SPA client side navigation are fully rendered
        const isBotRequest = isBotUserAgent(userAgent);

        const pipeOptions = {
            onAllReady() {
                shellRendered = true;
                const body = new PassThrough();
                const stream = createReadableStreamFromReadable(body);

                responseHeaders.set("Content-Type", "text/html");

                resolve(
                    new Response(stream, {
                        headers: responseHeaders,
                        status: responseStatusCode,
                    })
                );

                pipe(body);
            },
            onShellReady() {
                shellRendered = true;
                const body = new PassThrough();
                const stream = createReadableStreamFromReadable(body);

                responseHeaders.set("Content-Type", "text/html");

                resolve(
                    new Response(stream, {
                        headers: responseHeaders,
                        status: responseStatusCode,
                    })
                );

                pipe(body);
            },
            onShellError(error: unknown) {
                reject(error);
            },
            onError(error: unknown) {
                responseStatusCode = 500;
                if (shellRendered) {
                    console.error(error);
                }
            },
        };

        const { pipe, abort } = renderToPipeableStream(
            <ServerRouter context={routerContext} url={request.url} />,
            isBotRequest || routerContext.isSpaMode
                ? { onAllReady: pipeOptions.onAllReady, onShellError: pipeOptions.onShellError, onError: pipeOptions.onError }
                : { onShellReady: pipeOptions.onShellReady, onShellError: pipeOptions.onShellError, onError: pipeOptions.onError }
        );

        setTimeout(abort, streamTimeout + 1000);
    });
}
