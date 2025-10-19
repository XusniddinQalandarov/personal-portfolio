import { d as defineEventHandler, u as useRuntimeConfig, c as createError } from '../../nitro/nitro.mjs';
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

const experience_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const { data, error } = await client.from("experience").select("*").order("order_index", { ascending: true });
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch experience"
      });
    }
    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error("Experience API error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while fetching experience"
    });
  }
});

export { experience_get as default };
//# sourceMappingURL=experience.get.mjs.map
