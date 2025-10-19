import { d as defineEventHandler, u as useRuntimeConfig, g as getRouterParam, c as createError } from '../../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
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
    const { error } = await client.from("blogs").delete().eq("id", id);
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to delete blog"
      });
    }
    return {
      success: true,
      message: "Blog deleted successfully"
    };
  } catch (error) {
    console.error("Delete blog API error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal server error"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
