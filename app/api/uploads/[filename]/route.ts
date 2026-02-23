import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;
        const root = process.cwd();
        const uploadDir = join(root, 'public', 'uploads');
        const filePath = join(uploadDir, filename);

        if (!existsSync(filePath)) {
            console.error(`Image not found: ${filename} at ${filePath}`);
            return NextResponse.json({
                error: "File not found",
                filename,
                diagnostics: {
                    cwd: root,
                    checkedPath: filePath
                }
            }, { status: 404 });
        }

        const fileBuffer = await readFile(filePath);

        // Determine content type based on extension
        const ext = filename.split('.').pop()?.toLowerCase();
        let contentType = 'application/octet-stream';

        if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
        else if (ext === 'png') contentType = 'image/png';
        else if (ext === 'gif') contentType = 'image/gif';
        else if (ext === 'webp') contentType = 'image/webp';
        else if (ext === 'svg') contentType = 'image/svg+xml';

        return new Response(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error("Error serving file:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: (error as Error).message
        }, { status: 500 });
    }
}
