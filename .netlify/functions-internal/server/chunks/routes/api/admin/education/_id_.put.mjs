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
      statusMessage: "Education ID is required"
    });
  }
  try {
    const body = await readBody(event);
    const updateData = {};
    if (body.degree !== void 0) updateData.degree = body.degree;
    if (body.school !== void 0) updateData.school = body.school;
    if (body.year !== void 0) updateData.year = body.year;
    if (body.description !== void 0) updateData.description = body.description;
    if (body.order_index !== void 0) updateData.order_index = body.order_index;
    const { data, error } = await client.from("education").update(updateData).eq("id", id).select();
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to update education"
      });
    }
    if (!data || data.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Education not found"
      });
    }
    return {
      success: true,
      data: data[0]
    };
  } catch (error) {
    console.error("Update education API error:", error);
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
