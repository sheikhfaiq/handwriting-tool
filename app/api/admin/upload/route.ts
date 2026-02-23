import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Standardize filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const root = process.cwd();
        const uploadDir = resolve(root, 'public', 'uploads');

        console.log("Upload Debug:", {
            root,
            uploadDir,
            filename,
            exists: existsSync(uploadDir)
        });

        // Ensure directory exists
        if (!existsSync(uploadDir)) {
            console.log("Creating directory:", uploadDir);
            await mkdir(uploadDir, { recursive: true });
        }

        const path = join(uploadDir, filename);
        console.log("Writing file to:", path);
        await writeFile(path, buffer);

        // Return the API route path for better reliability in production
        const url = `/api/uploads/${filename}`;
        console.log("Returning URL:", url);
        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload error detail:", error);
        return NextResponse.json({ error: "Upload failed: " + (error as Error).message }, { status: 500 });
    }
}
