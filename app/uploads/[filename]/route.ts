import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;
        const root = process.cwd();

        // Try multiple potential upload directories
        const potentialDirs = [
            join(root, 'public', 'uploads'),
            join(root, 'uploads'),
            join(resolve(root, '..'), 'public', 'uploads')
        ];

        let filePath = "";
        let found = false;

        for (const dir of potentialDirs) {
            const p = join(dir, filename);
            if (existsSync(p)) {
                filePath = p;
                found = true;
                break;
            }
        }

        if (!found) {
            return NextResponse.json({
                error: "File not found on disk (legacy route)",
                filename,
                diagnostics: {
                    root,
                    checkedDirs: potentialDirs,
                    exists: potentialDirs.map(d => ({ dir: d, exists: existsSync(d) }))
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

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error("Error serving file via legacy route:", error);
        return NextResponse.json({ error: "Internal Server Error", details: (error as Error).message }, { status: 500 });
    }
}
