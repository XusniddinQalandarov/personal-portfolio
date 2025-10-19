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

const education_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const body = await readBody(event);
    if (!body.degree || !body.school || !body.year) {
      throw createError({
        statusCode: 400,
        statusMessage: "Degree, school, and year are required"
      });
    }
    const { data, error } = await client.from("education").insert([
      {
        degree: body.degree,
        school: body.school,
        year: body.year,
        description: body.description || null,
        order_index: body.order_index || 0
      }
    ]).select();
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create education"
      });
    }
    return {
      success: true,
      data: data[0]
    };
  } catch (error) {
    console.error("Create education API error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal server error"
    });
  }
});

export { education_post as default };
//# sourceMappingURL=education.post.mjs.map
