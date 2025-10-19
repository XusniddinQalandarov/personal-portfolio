import { d as defineEventHandler, u as useRuntimeConfig, r as readBody, c as createError } from '../../../../nitro/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const body = await readBody(event);
    const { data, error } = await client.from("projects").update({
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
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select();
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to update project"
      });
    }
    return {
      success: true,
      message: "Project updated successfully!",
      data
    };
  } catch (error) {
    console.error("Update project error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while updating project"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
