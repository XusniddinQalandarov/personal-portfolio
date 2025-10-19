import { d as defineEventHandler, b as readMultipartFormData } from '../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'ipx';

const uploadImage_post = defineEventHandler(async (event) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const form = await readMultipartFormData(event);
    if (!form || form.length === 0) {
      return {
        success: false,
        error: "No file uploaded"
      };
    }
    const fileData = form[0];
    if (!fileData.data || !fileData.filename) {
      return {
        success: false,
        error: "Invalid file data"
      };
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (fileData.type && !allowedTypes.includes(fileData.type)) {
      return {
        success: false,
        error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
      };
    }
    const maxSize = 5 * 1024 * 1024;
    if (fileData.data.length > maxSize) {
      return {
        success: false,
        error: "File too large. Maximum size is 5MB"
      };
    }
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = fileData.filename.split(".").pop();
    const filename = `${timestamp}-${randomStr}.${extension}`;
    const { data, error } = await supabase.storage.from("blog-images").upload(filename, fileData.data, {
      contentType: fileData.type || "image/jpeg",
      cacheControl: "3600",
      upsert: false
    });
    if (error) {
      console.error("Supabase upload error:", error);
      return {
        success: false,
        error: `Failed to upload image: ${error.message}`
      };
    }
    const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(filename);
    return {
      success: true,
      url: urlData.publicUrl,
      filename
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image"
    };
  }
});

export { uploadImage_post as default };
//# sourceMappingURL=upload-image.post.mjs.map
