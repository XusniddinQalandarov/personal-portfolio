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

const _id__patch = defineEventHandler(async (event) => {
  var _a;
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const body = await readBody(event);
    const { data, error } = await client.from("contact_messages").update({ read: body.read }).eq("id", id).select();
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to update message"
      });
    }
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error("Update message error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while updating message"
    });
  }
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
