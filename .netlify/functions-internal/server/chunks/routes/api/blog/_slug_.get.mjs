import { d as defineEventHandler, u as useRuntimeConfig, g as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
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

const _slug__get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is required"
    });
  }
  try {
    const { data, error } = await client.from("blogs").select("*").eq("slug", slug).eq("published", true).single();
    if (error) {
      if (error.code === "PGRST116") {
        throw createError({
          statusCode: 404,
          statusMessage: "Blog not found"
        });
      }
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch blog"
      });
    }
    const newViews = (data.views || 0) + 1;
    await client.from("blogs").update({ views: newViews }).eq("id", data.id);
    return {
      success: true,
      data: {
        ...data,
        views: newViews
      }
    };
  } catch (error) {
    console.error("Blog API error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal server error"
    });
  }
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map
