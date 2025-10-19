import { d as defineEventHandler, u as useRuntimeConfig, c as createError } from '../../../../nitro/nitro.mjs';
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
  var _a;
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const { error } = await client.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Supabase error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to delete project"
      });
    }
    return {
      success: true,
      message: "Project deleted successfully!"
    };
  } catch (error) {
    console.error("Delete project error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while deleting project"
    });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
