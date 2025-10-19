import { d as defineEventHandler, u as useRuntimeConfig, a as getQuery, c as createError } from '../../nitro/nitro.mjs';
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

const blogs_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const query = getQuery(event);
    const tag = query.tag;
    const search = query.search;
    let queryBuilder = client.from("blogs").select("id, title, slug, excerpt, image_url, tags, views, created_at, updated_at").eq("published", true).order("created_at", { ascending: false });
    if (tag) {
      queryBuilder = queryBuilder.contains("tags", [tag]);
    }
    if (search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }
    const { data, error } = await queryBuilder;
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch blogs"
      });
    }
    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error("Blogs API error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal server error"
    });
  }
});

export { blogs_get as default };
//# sourceMappingURL=blogs.get.mjs.map
