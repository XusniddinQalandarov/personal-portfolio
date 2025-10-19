import { d as defineEventHandler, u as useRuntimeConfig, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
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

const create_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const body = await readBody(event);
    if (!body.title || !body.description) {
      throw createError({
        statusCode: 400,
        statusMessage: "Title and description are required"
      });
    }
    const { data, error } = await client.from("projects").insert([
      {
        title: body.title,
        description: body.description,
        long_description: body.long_description,
        image: body.image,
        technologies: body.technologies || [],
        category: body.category,
        github_url: body.github_url,
        demo_url: body.demo_url,
        featured: body.featured || false,
        status: body.status || "Completed",
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ]).select();
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create project"
      });
    }
    return {
      success: true,
      message: "Project created successfully!",
      data
    };
  } catch (error) {
    console.error("Create project error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while creating project"
    });
  }
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
