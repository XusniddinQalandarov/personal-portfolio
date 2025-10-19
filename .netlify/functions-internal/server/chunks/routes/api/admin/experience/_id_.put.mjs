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
      statusMessage: "Experience ID is required"
    });
  }
  try {
    const body = await readBody(event);
    const updateData = {};
    if (body.title !== void 0) updateData.title = body.title;
    if (body.company !== void 0) updateData.company = body.company;
    if (body.period !== void 0) updateData.period = body.period;
    if (body.description !== void 0) updateData.description = body.description;
    if (body.current !== void 0) updateData.current = body.current;
    if (body.order_index !== void 0) updateData.order_index = body.order_index;
    const { data, error } = await client.from("experience").update(updateData).eq("id", id).select();
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to update experience"
      });
    }
    if (!data || data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Experience not found"
      });
    }
    return {
      success: true,
      data: data[0]
    };
  } catch (error) {
    console.error("Update experience API error:", error);
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
