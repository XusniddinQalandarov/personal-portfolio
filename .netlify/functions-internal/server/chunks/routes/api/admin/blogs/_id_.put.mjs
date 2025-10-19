import { d as defineEventHandler, u as useRuntimeConfig, g as getRouterParam, c as createError, r as readBody } from '../../../../nitro/nitro.mjs';
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
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Blog ID is required"
    });
  }
  try {
    const body = await readBody(event);
    const updateData = {};
    if (body.title !== void 0) updateData.title = body.title;
    if (body.slug !== void 0) updateData.slug = body.slug;
    if (body.excerpt !== void 0) updateData.excerpt = body.excerpt;
    if (body.content !== void 0) updateData.content = body.content;
    if (body.image_url !== void 0) updateData.image_url = body.image_url;
    if (body.tags !== void 0) updateData.tags = body.tags;
    if (body.published !== void 0) updateData.published = body.published;
    const { data, error } = await client.from("blogs").update(updateData).eq("id", id).select();
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to update blog"
      });
    }
    if (!data || data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Blog not found"
      });
    }
    return {
      success: true,
      data: data[0]
    };
  } catch (error) {
    console.error("Update blog API error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal server error"
    });
  }
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
