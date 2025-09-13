import { NextResponse } from "next/server"
import { writeFile, mkdir, rename, access } from "fs/promises"
import { constants } from "fs"
import path from "path"

const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/x-shockwave-flash"]

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const files = formData.getAll("files") as File[];
    const paths = formData.getAll("paths") as string[];


    if (!files || !paths || files.length === 0 || paths.length === 0 || files.length != paths.length) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    const results: { file: string; status: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const savePath = paths[i] || file.name;

      console.log(`Test 1: ${paths[i]}`);
      console.log(`Uploading ${file.name} to ${savePath}`);

      try {
        if (!ALLOWED_TYPES.includes(file.type)) {
          results.push({
            file: file.name,
            status: `❌ Skipped (invalid type: ${file.type})`,
          });
          continue;
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fullPath = path.join(process.cwd(), (savePath.indexOf("posts") != -1 || savePath.indexOf("achievements") != -1 ? "public/assets/images" : "gamefiles"), savePath);

        console.log(`Full Path: ${fullPath}`);

        const dir = path.dirname(fullPath);
        await mkdir(dir, { recursive: true });

        try {
          await access(fullPath, constants.F_OK);

          const ext = path.extname(fullPath); // e.g. .jpg
          const base = path.basename(fullPath, ext); // e.g. test
          let counter = 1;
          let newName = `${base}_${counter}${ext}`;
          let renamedPath = path.join(dir, newName);

          while (true) {
            try {
              await access(renamedPath, constants.F_OK);
              counter++;
              newName = `${base}_${counter}${ext}`;
              renamedPath = path.join(dir, newName);
            } catch {
              break;
            }
          }

          await rename(fullPath, renamedPath);

          results.push({
            file: file.name,
            status: `ℹ️ Existing file renamed to ${newName}`,
          });
        } catch {
        }

        await writeFile(fullPath, buffer);

        results.push({ file: file.name, status: "✅ Saved successfully" });
      } catch (err) {
        results.push({ file: file.name, status: "❌ Failed to save" });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unexpected upload error " + error },
      { status: 500 }
    );
  }
}
