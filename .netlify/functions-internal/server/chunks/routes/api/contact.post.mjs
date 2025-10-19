import { d as defineEventHandler, u as useRuntimeConfig, r as readBody, c as createError } from '../../nitro/nitro.mjs';
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

const contact_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const client = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );
  try {
    const body = await readBody(event);
    if (!body.name || !body.email || !body.subject || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: "All fields are required"
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid email format"
      });
    }
    const { data, error } = await client.from("contact_messages").insert([
      {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        read: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ]).select();
    if (error) {
      console.error("Supabase error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to save message: ${error.message || "Unknown error"}`
      });
    }
    return {
      success: true,
      message: "Your message has been sent successfully!",
      data
    };
  } catch (error) {
    console.error("Contact form error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred while processing your request"
    });
  }
});

export { contact_post as default };
//# sourceMappingURL=contact.post.mjs.map
