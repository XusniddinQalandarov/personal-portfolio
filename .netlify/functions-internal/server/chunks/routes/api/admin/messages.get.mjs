import { d as defineEventHandler, u as useRuntimeConfig, c as createError } from '../../../nitro/nitro.mjs';
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

const messages_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const { data, error } = await client.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch messages"
      });
    }
    return {
      success: true,
      data: data || []
    };
  } catch (error) {
    console.error("Messages API error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while fetching messages"
    });
  }
});

export { messages_get as default };
//# sourceMappingURL=messages.get.mjs.map
